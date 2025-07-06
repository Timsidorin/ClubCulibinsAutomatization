// models/Teacher.js
export class Teacher {
  constructor({
    id = null,
    firstName = '',
    lastName = '',
    middleName = '',
    telegramUsername = '',
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.telegramUsername = telegramUsername;
  }

  // Геттер для полного имени
  get fullName() {
    return [this.lastName, this.firstName, this.middleName]
      .filter(Boolean)
      .join(' ');
  }

  // Метод для преобразования в объект для API (на создание/обновление)
  toApiObject() {
    return {
      tgUsername: this.telegramUsername.startsWith('@') ? this.telegramUsername : `@${this.telegramUsername}`,
      name: this.firstName,
      lastName: this.lastName,
      secondName: this.middleName
    };
  }

  // Статический метод для создания из API-ответа (возврат всех учителей)
  static fromApiObject(apiData) {
    // Учитываем вложенную структуру PersonalDatum
    const personalData = apiData.PersonalDatum || {};
    return new Teacher({
      id: apiData.uuid,
      firstName: personalData.name || '',
      lastName: personalData.lastName || '',
      middleName: personalData.secondName || '',
      telegramUsername: apiData.tgUsername || ''
    });
  }
}
