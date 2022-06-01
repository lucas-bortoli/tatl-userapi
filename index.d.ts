import _ProgramManifest from "./programManifest"
import "./FileSystem"

export namespace Tatl {
    namespace Utils {
        namespace Geometry {
            interface Point { x: number, y: number }
            interface Size { width: number, height: number }
            interface Rectangle { x: number, y: number, width: number, height: number }
        }
    }

    namespace Windows {
        type WindowState = 'Maximized'|'Minimized'|'Normal'
        interface WindowConstructProperties {
            position: Utils.Geometry.Point|'center',
            size: Utils.Geometry.Size,
            minimumSize: Utils.Geometry.Size,
            maximumSize: Utils.Geometry.Size,
            resizable: boolean
            title: string
        }

        interface Window {
            readonly id: number,
            readonly ownerProcess: System.ProcessId,

            getMaximumSize: () => Utils.Geometry.Size
            setMaximumSize: (newSize: Utils.Geometry.Size) => void
            getMinimumSize: () => Utils.Geometry.Size
            setMinimumSize: (newSize: Utils.Geometry.Size) => void
            getResizable: () => boolean,
            setResizable: (isResizable: boolean) => void,
            getState: () => WindowState,
            setState: (newState: WindowState) => void,
            getTitle: () => string,
            setTitle: (newTitle: string) => void
            getPosition: () => Utils.Geometry.Point
            setPosition: (newPosition: Utils.Geometry.Point|'center') => void
            getSize: () => Utils.Geometry.Size
            setSize: (newSize: Utils.Geometry.Size) => void
            getClientFrame: () => HTMLIFrameElement
            getRectangle: () => Utils.Geometry.Rectangle
        }

        interface WindowManager {
            windows: Map<number, Window>,
            createWindow(ownerProcess: System.ProcessId, properties: WindowConstructProperties): Window
            destroyWindow(windowId: number): void
        }
    }

    namespace System {
        type ProgramManifest = _ProgramManifest
        
        namespace SystemMessage {
            interface WindowDestroyedMessage {
                id: 'WindowDestroyed',
                windowId: number
            }

            type Message = WindowDestroyedMessage
        }

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
            OnMessage?: (sender: ProcessId, messageChannel: string, messageData: object) => void,
            OnSystemMessage?: (message: SystemMessage.Message) => void
        }

        interface Core {
            processes: Map<ProcessId, Process>,
            spawnProcess: (processArgs: Omit<Process, 'id'>) => Process,
            killProcess: (target: ProcessId, signal: number) => void,
            sendProcessMessage: (sender: ProcessId, targetId: ProcessId, messageChannel: string, messageData: object) => void
        }
    }

    namespace FileSystem {
        type Hash = string
        
        interface IFile {
            type: 'file',
            name: string,
            size: number
        }
    
        interface IDirectory {
            type: 'dir',
            name: string,
            children: (IFile | IDirectoryWithoutChildren)[]
        }
    
        type IDirectoryWithoutChildren = Pick<IDirectory, 'type'|'name'>
        type IEntry = IFile | IDirectory
    
    
        type EACCESS = Error
        type EADDRINUSE = Error
        type ENOTSUP = Error
        type EFBIG = Error
        type EIO = Error
        type EISDIR = Error
        type EISFILE = Error
        type EEXISTS = Error
        type ENOENT = Error
        type ENOSPC = Error
        type ENOTEMPTY = Error
    
        interface IFileSystem {
            ls(target: string): Promise<(IFile | IDirectoryWithoutChildren)[]>,
            get(target: string, encoding: 'blob'|'data-uri'|'utf8'): Promise<Blob|string|ArrayBuffer>,
            put(target: string, data: Blob): Promise<number>,
            cp(source: string, target: string): Promise<void>,
            mv(source: string, target: string): Promise<void>,
            mkdir(target: string): Promise<string>,
            rm(target: string): Promise<void>,
            access(target: string): Promise<IFile | IDirectory>
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
    var $CurrentWindow: Tatl.Windows.Window|null
    var $FS: Tatl.FileSystem.IFileSystem
}