"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "User",
      [
        {
          user: "hendrius.santana",
          senha: "Tpm2199*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user: "josivan",
          senha: "Tpm2199*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("User", null, {});
  },
};
