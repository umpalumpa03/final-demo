import { BirthdayEmoji } from "../models/birthday.model";

export const BIRTHDAY_EMOJIS: BirthdayEmoji[] = [
  { name: 'header', svgPath: 'images/svg/birthday/birthday-top-icon.svg' },
  { name: 'gift', svgPath: 'images/svg/birthday/birthday-middle1.svg' },
  { name: 'cake', svgPath: 'images/svg/birthday/birthday-middle2.svg' },
  { name: 'sparkles', svgPath: 'images/svg/birthday/birthday-middle3.svg' },
  { name: 'star', svgPath: 'images/svg/birthday/birthday-middle4.svg' },
  { name: 'hearth', svgPath: 'images/svg/birthday/birthday-middle5.svg' },
  { name: 'buttonHearth', svgPath: 'images/svg/birthday/birthday-buttonicon.svg' },

] as const;