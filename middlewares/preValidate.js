const { celebrate, Joi } = require('celebrate');

const preValidateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL'),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const preValidateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const preValidateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const preValidateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const preValidateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL')
      .min(2)
      .required(),
  }),
});

const preValidateCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL').required(),
  }),
});

module.exports = {
  preValidateNewUser,
  preValidateLogin,
  preValidateUserData,
  preValidateAvatar,
  preValidateId,
  preValidateCardData,
};
