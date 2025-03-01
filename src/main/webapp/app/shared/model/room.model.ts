export interface IRoom {
  id?: number;
  name?: string;
  capacity?: number | null;
}

export const defaultValue: Readonly<IRoom> = {};
