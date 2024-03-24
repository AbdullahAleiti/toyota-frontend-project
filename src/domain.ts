export type FilterBased = {
  filterCode: string;
  linkCount?: number;
  userDesc?: string;
  termName?: string;
};

export type Department = {
  depName?: string;
  depCode?: string;
  shopCode?: string;
  filterBaseds?: FilterBased[];
};

export type Terminal = {
  termId?: number;
  depCode?: string;
  termName?: string;
  searchType?: string;
  lastAssyNo?: number;
  searchRequired?: string;
  line?: number;
  filterCode?: string;
};

export type DefectButtonRecord = {
  boxX: number;
  boxY: number;
  lineX?: number;
  lineY?: number;
  boxWidth: number;
  boxHeight: number;
  labelText?: string;
  boxColor: string;
  childPicID?: number;
};

export type DefectHeader = {
  seqNo: number;
  bodyNo: number;
  bgColor?: string;
  extCode: string;
  firstname: string;
  lastname: string;
  departmentCode?: string;
};

export type Defect = {
  defectName: string;
  defectId: number;
};
export type Defects = {
  terminalPictureId: number;
  partDefects: Defect[];
  defectButtonRecords: DefectButtonRecord[];
};
