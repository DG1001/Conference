import { IRoom } from 'app/shared/model/room.model';
import { ITimeslot } from 'app/shared/model/timeslot.model';

export interface ITalk {
  id?: number;
  title?: string;
  speaker?: string;
  abstractText?: string;
  room?: IRoom;
  timeslot?: ITimeslot;
}

export const defaultValue: Readonly<ITalk> = {};
