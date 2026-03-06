import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '../../store/store';
import { login, clearError } from '../../store/slices/authSlice';
import { Icon } from '../../components';

import s from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Редирект если уже авторизован
  useEffect(() => {
    if (token) {
      navigate('/products', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!username.trim()) {
      errors.username = 'Логин обязателен';
    }
    if (!password.trim()) {
      errors.password = 'Пароль обязателен';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const resultAction = await dispatch(login({
        credentials: { username, password },
        rememberMe
      }));

      if (login.fulfilled.match(resultAction)) {
        toast.success('Успешный вход!');
      } else {
        toast.error('Ошибка авторизации');
        console.log('Авторизация отклонена:', resultAction.payload);
      }
    } catch (error) {
      toast.error('Ошибка авторизации');
      console.error('Авторизация не удалась:', error);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.loginBox}>
        <div className={s.loginInnerBox}>
          <Icon name="logo" width={72} height={72} className={s.logo} />
          <div className={s.welcomeBox}>
            <h1 className={s.title}>Добро пожаловать!</h1>
            <h4 className={s.subtitle}>Пожалуйста, авторизуйтесь</h4>
          </div>

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.inputsContainer}>
              <div className={s.inputGroup}>
                <label htmlFor="username" className={s.label}>
                  Логин
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${s.input} ${validationErrors.username ? s.inputError : ''}`}
                  placeholder="Введите логин"
                  disabled={isLoading}
                />
                {validationErrors.username && (
                  <span className={s.errorText}>{validationErrors.username}</span>
                )}
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="password" className={s.label}>
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${s.input} ${validationErrors.password ? s.inputError : ''}`}
                  placeholder="Введите пароль"
                  disabled={isLoading}
                />
                {validationErrors.password && (
                  <span className={s.errorText}>{validationErrors.password}</span>
                )}
              </div>
            </div>

            <div className={s.checkboxGroup}>
              <label className={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Запомнить данные</span>
              </label>
            </div>

            <div className={s.formFooter}>
              <button
                type="submit"
                className={s.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
              <div className={s.dividers}>
                <i></i>
                <span>или</span>
                <i></i>
              </div>
            </div>
          </form>

          <div className={s.signUp}>
            <span>Нет аккаунта?</span>
            <p>Создать</p>
          </div>

          {/*/!*TODO удалить*!/*/}
          {/*  <p>Логин: emilys</p>*/}
          {/*  <p>Пароль: emilyspass</p>*/}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;