import { validateSync } from 'class-validator';
import { CreateDogDto } from './create-dog.dto';
import { UpdateDogDto } from './update-dog.dto';

const validBreedId = '11111111-1111-4111-8111-111111111111';

describe('Dog birthday DTO validation', () => {
  it('accepts valid birthday values on create', () => {
    const dto = Object.assign(new CreateDogDto(), {
      name: 'エマ',
      breedId: validBreedId,
      birthYear: 2023,
      birthMonth: 12,
      birthDay: 3,
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects invalid birthday values on create', () => {
    const dto = Object.assign(new CreateDogDto(), {
      name: 'エマ',
      breedId: validBreedId,
      birthMonth: 13,
      birthDay: 0,
    });

    const errors = validateSync(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toEqual(
      expect.arrayContaining(['birthMonth', 'birthDay']),
    );
  });

  it('accepts valid birthday values on update', () => {
    const dto = Object.assign(new UpdateDogDto(), {
      birthYear: 2022,
      birthMonth: 2,
      birthDay: 29,
    });

    expect(validateSync(dto)).toHaveLength(0);
  });
});
