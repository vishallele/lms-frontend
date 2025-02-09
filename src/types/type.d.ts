interface IUserRegister {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string
}

interface IResetPassword {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}