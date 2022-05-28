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
            readonly ownerProcess: number,
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
        interface ProcessArgs {
            files?: string[]
        }

        interface Process {
            readonly id: number,
            readonly sourceFile: string,
            cwd: string,
            args: ProcessArgs
        }

        interface CurrentProcess extends Process {
            OnMessage?: (sender: Process, messageChannel: string, messageData) => void
        }

        interface Core {
            processes: Process[],
            spawnProcess: (processArgs: Omit<Process, 'id'>) => Process,
            killProcess: (procId, signal: number) => void,
            sendProcessMessage: (sender: Process, target: Process, messageChannel: string, messageData: any) => void
        }
    }
}

declare const $OS: {
    Windows: { WindowManager: Tatl.Windows.WindowManager },
    System: {
        Core: Tatl.System.Core
    }
}

declare const $CurrentProc: Tatl.System.CurrentProcess