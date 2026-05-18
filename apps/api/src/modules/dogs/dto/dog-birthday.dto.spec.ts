import { validateSync } from 'class-validator';
import { CreateDogDto } from './create-dog.dto';
import { UpdateDogDto } from './update-dog.dto';

const validBreedId = '11111111-1111-4111-8111-111111111111';

describe('Dog birthday DTO validation', () => {
  it('accepts valid birthday values on create', () => {
    const dto = Object.assign(new CreateDogDto(), {
      name: 'エマ',
      breedId: validBreedId,
      birthYear: 2024,
      birthMonth: 2,
      birthDay: 29,
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

  it('rejects invalid day combinations on update', () => {
    const dto = Object.assign(new UpdateDogDto(), {
      birthYear: 2022,
      birthMonth: 2,
      birthDay: 29,
    });

    const errors = validateSync(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toEqual(
      expect.arrayContaining(['birthMonth', 'birthDay']),
    );
  });

  it('rejects incomplete birthday values on update', () => {
    const dto = Object.assign(new UpdateDogDto(), {
      birthMonth: 4,
    });

    const errors = validateSync(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toContain('birthMonth');
  });

  it('accepts trimming fields on create', () => {
    const dto = Object.assign(new CreateDogDto(), {
      name: 'エマ',
      breedId: validBreedId,
      trimmingStyle: 'テディベアカット',
      salonUrl: 'https://example.com/salon',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects invalid salon url on update', () => {
    const dto = Object.assign(new UpdateDogDto(), {
      salonUrl: 'not-a-url',
    });

    const errors = validateSync(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toContain('salonUrl');
  });
});
