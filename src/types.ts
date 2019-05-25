export const fileConstants = {
   OPEN_FILE: 'OPEN_FILE',
   ADD_SECTION: 'ADD_SECTION',
   ADD_DATA: 'ADD_DATA',
   ADD_ASCII: 'ADD_ASCII',
   RESET_LAS: 'RESET_LAS',
   CURRENT_SECTION: 'CURRENT_SECTION',
   CHART_CURVE: 'CHART_CURVE',
};

// Describing the different ACTION NAMES available
export const TEST = "TEST";
export const ASCII = "ASCII";


export interface TestAction {
   type: typeof TEST
   testString: string
}
export interface DataEntry {
   mnem: string,
   unit: string,
   data: string,
   desc: string

}

export interface TheFile {
   name: string
   size: number
   lastModified: number
   lastModifiedDate: string
   type: string
   raw: string
   
}
//files
export interface AddSection {
   type: typeof fileConstants.ADD_SECTION,
   section: string,
}
export interface CurrentSection {
   type: typeof fileConstants.CURRENT_SECTION,
   section: string,
}
export interface Reset {
   type: typeof fileConstants.RESET_LAS,
}
export interface AddData {
   type: typeof fileConstants.ADD_DATA,
   section: string,
   data: DataEntry
}
export interface AddAscii {
   type: typeof fileConstants.ADD_ASCII,
   data:  Array<Array<number>>
}

export interface OpenFile {
   type: typeof fileConstants.OPEN_FILE,
   file: TheFile,
   raw:  string
}
export interface ChartCurve {
   type: typeof fileConstants.CHART_CURVE,
   curve:  string
}

export interface FileInterface {
   type: string,
   section: string,
   data: DataEntry | Array<Array<number>>
   file: TheFile,
   raw:  string
   curve:  string
}


//export type Action = SetAction | SetFetcing <- to combine
export type Action = TestAction 
// export type FileAction =  
//    AddSection & CurrentSection & Reset
export type FileActionTypes = AddSection | CurrentSection | Reset | AddData | AddAscii | OpenFile | ChartCurve

//// reducers
// States' definition
export interface RunTest {
   test: string
   accessToken?: string
}
export interface FileState {
   section: string,
   chartCurve: string,
   chunk: number,
   [ASCII]: {
      data: Array<string>
   },
}



export interface State {
   runTest: RunTest
   files: any
}


