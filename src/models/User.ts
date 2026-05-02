/**
 * Class User - Ánh xạ từ Class Diagram
 * Tính Đóng gói (Encapsulation): thuộc tính private, truy cập qua getter
 */
export class User {
  private _userId: string;
  private _username: string;
  private _email: string;

  constructor(userId: string, username: string, email: string) {
    this._userId = userId;
    this._username = username;
    this._email = email;
  }

  // Getters - đảm bảo tính đóng gói
  get userId(): string {
    return this._userId;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }
}