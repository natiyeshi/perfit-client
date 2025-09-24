export interface DashboardItem {
  DashboardId: string;
  DashboardItemSeqId: string;
  Title: string;
  Color: string | null;
  Icon: string | null;
  Description: string | null;
  RowNumber: number;
  ColumnNumber: number;
  RowLength: number;
  ColumnLength: number;
  ComponentTypeId: string;
  ComponentTypeDescription: string | null;
  ReportUrl: string | null;
  CardValue: string | null;
  ChartValue: unknown | null;
  ListValue: unknown | null;
  DataSource: string | null;
  DataSourceDetail: string | null;
  Settings: string | null;
  SettingsObj: unknown | null;
}

export interface DashboardResponse {
  Data: {
    DashboardId: string;
    DashBoardDescription: string;
    RefreshTimeoutInSeconds: number;
    Items: DashboardItem[];
  };
  AssociateDatas: unknown[];
  EntityCount: number;
  CurrentPage: unknown | null;
  IsSuccess: boolean;
  ErrorMessage: string | null;
}
