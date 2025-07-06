// models/Teacher.js
export class Teacher {
  constructor({
    id = null,
    firstName = '',
    lastName = '',
    middleName = '',
    telegramUsername = '',
    email = '',
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.telegramUsername = telegramUsername;
    this.email = email;
  }

  // Геттер для полного имени
  get fullName() {
    return [this.lastName, this.firstName, this.middleName]
      .filter(Boolean)
      .join(' ');
  }

  // Метод для преобразования в объект для API
  toApiObject() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      middle_name: this.middleName,
      telegram_username: this.telegramUsername,
      email: this.email,
    };
  }

  // Статический метод для создания из API-ответа
  static fromApiObject(apiData) {
    return new Teacher({
      id: apiData.id,
      firstName: apiData.first_name || '',
      lastName: apiData.last_name || '',
      middleName: apiData.middle_name || '',
      telegramUsername: apiData.telegram_username || '',
      email: apiData.email || '',
      groups: apiData.groups || []
    });
  }
}
