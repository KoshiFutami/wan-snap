import {
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

type BirthdayInput = {
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
};

@ValidatorConstraint({ name: 'IsValidBirthDate', async: false })
export class IsValidBirthDateConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const object = args.object as BirthdayInput;
    const { birthYear, birthMonth, birthDay } = object;

    if (birthMonth == null && birthDay == null) return true;
    if (birthMonth == null || birthDay == null) return false;

    const year = birthYear ?? 2000;
    const maxDay = new Date(year, birthMonth, 0).getDate();
    return birthDay <= maxDay;
  }

  defaultMessage(): string {
    return '誕生日は月日をセットで指定し、存在する日付を入力してください';
  }
}
