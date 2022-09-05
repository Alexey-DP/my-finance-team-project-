import * as Yup from 'yup';

export const PersonalInfoSchema = Yup.object({
  first_name: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .matches(
      /^[a-zA-ZА-ЯҐЄІЇа-яієїґ0-9\s'-]+$/,
      ' not allowed special symbols except space and dash ',
    )
    .required('Required'),

  last_name: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .matches(
      /^[a-zA-ZА-ЯҐЄІЇа-яієїґ0-9\s'-]+$/,
      ' not allowed special symbols except space and dash ',
    )
    .required('Required'),

  email: Yup.string()
    .required('Email cannot be empty')
    .email()
    .max(320, 'Email must be less than 320 characters.'),

  address: Yup.string()
    .max(256, 'Must be 256 characters or less')
    .notOneOf(['<', '>'])
    .required('Required'),

  // birthdate: Yup.string()
  //   .required('Birthdate cannot be empty')
  //   .matches(
  //     /\d{4}[-]\d{1,2}[-]\d{1,2}/,
  //     'Incorrect date. Should be YYYY-MM-DD',
  //   ),

  birthdate: Yup.string().required('Birthdate cannot be empty'),

  phone: Yup.string()
    .matches(/^\+?3?8?(0\d{9})$/, 'Phone number is not valid')
    .required('Required'),
});
