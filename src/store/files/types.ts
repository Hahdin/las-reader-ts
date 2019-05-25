export const fileConstants = {
   OPEN_FILE: 'OPEN_FILE',
   ADD_SECTION: 'ADD_SECTION',
   ADD_DATA: 'ADD_DATA',
   ADD_ASCII: 'ADD_ASCII',
   RESET_LAS: 'RESET_LAS',
   CURRENT_SECTION: 'CURRENT_SECTION',
   CHART_CURVE: 'CHART_CURVE',
};
export const ASCII = "ASCII";
export interface DataEntry {
   mnem: string,
   unit: string,
   data: string,
   desc: string
}

export interface FileState {
   name: string
   section: string,
   chartCurve: string,
   chunk: number,
   [ASCII]: {
      data: Array<Array<string>>
   },
   [key:string]: any; 
}

export interface TheFile {
   name: string
   size: number
   lastModified: number
   lastModifiedDate: string
   type: string
   raw: string
}

export interface FileInterface {
   type: string,
   section: string,
   data: DataEntry
   asciiData: Array<Array<string>>
   file: TheFile,
   raw:  string
   curve:  string
}
