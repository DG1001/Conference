import dayjs from 'dayjs';

export interface ITimeslot {
  id?: number;
  start?: dayjs.Dayjs;
  end?: dayjs.Dayjs;
}

export const defaultValue: Readonly<ITimeslot> = {};
