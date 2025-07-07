// models/Teachers.js
export class Teachers {
  constructor({
    id = null,
    firstName = '',
    lastName = '',
    middleName = '',
    telegramUsername = '',
    typeUser =  0
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.telegramUsername = telegramUsername;
    this.typeUser = typeUser;
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
      secondName: this.middleName,
      typeUser:this.typeUser
    };
  }

  // Статический метод для создания из API-ответа (возврат всех учителей)
  static fromApiObject(apiData) {
    // Учитываем вложенную структуру PersonalDatum
    const personalData = apiData.PersonalDatum || {};
    return new Teachers({
      id: apiData.uuid,
      firstName: personalData.name || '',
      lastName: personalData.lastName || '',
      middleName: personalData.secondName || '',
      telegramUsername: apiData.tgUsername || '',
      typeUser: apiData.typeUser || '',

    });
  }
}
