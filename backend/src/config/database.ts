import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('game', 'postgres', 'admin', {
    host: '127.127.126.5',
    dialect: 'postgres'
});