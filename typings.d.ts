export namespace Tatl {
    namespace Utils {
        namespace Geometry {
            interface Point { x: number, y: number }
            interface Size { width: number, height: number }
            type Rectangle = Point | Size
        }
    }

    namespace Windows {
        type WindowState = 'Maximized'|'Minimized'|'Normal'
        type WindowConstructProperties = Partial<Omit<Window, 'id'|'ownerProcess'|'getRectangle'>>

        interface Window {
            readonly id: number,
            readonly ownerProcess: System.ProcessId,
            title: string,
            position: Utils.Geometry.Point,
            size: Utils.Geometry.Size,
            maximumSize: Utils.Geometry.Size,
            minimumSize: Utils.Geometry.Size,
            resizable: boolean,
            state: WindowState,
            getClientFrame: () => HTMLIFrameElement
            getRectangle: () => Utils.Geometry.Rectangle
        }

        interface WindowManager {
            windows: Window[],
            createWindow(properties: WindowConstructProperties): Window
            destroyWindow(): void
        }
    }

    namespace System {
        type ProcessId = number

        interface ProcessArgs {
            files?: string[]
        }

        interface Process {
            readonly id: ProcessId,
            readonly sourceFile: string,
            cwd: string,
            args: ProcessArgs
        }

        interface CurrentProcess extends Process {
            OnMessage?: (sender: ProcessId, messageChannel: string, messageData: object) => void
        }

        interface Core {
            processes: Process[],
            spawnProcess: (processArgs: Omit<Process, 'id'>) => Process,
            killProcess: (target: ProcessId, signal: number) => void,
            sendProcessMessage: (sender: ProcessId, targetId: ProcessId, messageChannel: string, messageData: object) => void
        }
    }

    namespace GlobalAPIs {
        interface $OS {
            Windows: { WindowManager: Windows.WindowManager },
            System: { Core: System.Core }
        }

        type $CurrentProc = Tatl.System.CurrentProcess
    }
}

// Global APIs
declare global {
    var $OS: Tatl.GlobalAPIs.$OS
    var $CurrentProc: Tatl.System.CurrentProcess
}