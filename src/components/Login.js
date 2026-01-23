import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  TextField,
  Button,
  Checkbox,
  Typography,
  Link,
  Alert,
  IsotypeName,
  DefaultComponents
} from '@nuam/common-fe-lib-components';
import { useAuth } from '../hooks/useAuth';

const { Box, Container } = DefaultComponents;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir a la página anterior o al dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/background-img.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <IsotypeName
            logoSrc="/isotype.svg"
            projectName="nubo"
            showText
            size="md"
          />
        </Box>
        <Card
          title="Iniciar Sesión"
          subTitle="Ingresa tus credenciales para continuar"
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              fullWidth
              required
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              fullWidth
              required
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Checkbox
                label="Recordarme"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <Link href="#" underline="hover">
                <Typography variant="body2">¿Olvidaste tu contraseña?</Typography>
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                ¿No tienes cuenta?{' '}
                <Link href="#" underline="hover">
                  Regístrate
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;