export default interface ProgramManifest {
    /** 
     * A unique program identifier 
     */
    name: string,
    /** An optional friendly program name
     * If missing, the .name field is used
     */
    friendlyName?: string,
    /**
     * The program description, shown in menus
     */
    description: string,
    /**
     * Main process file, relative to the program directory
     * @example "./main.js"
     */
    mainProcessFile: string,
    /** 
     * Whether to allow multiple instances of this program 
     */
    singleton: boolean
}