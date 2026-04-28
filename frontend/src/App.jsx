import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'

const PET_TYPE_COLORS = {
  Dog: '#ef4444',
  Cat: '#f97316',
  Bird: '#0ea5e9',
  Fish: '#14b8a6',
}

export default function App() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          background: {
            default: '#f6f3ef',
          },
          primary: {
            main: '#c2410c',
          },
          text: {
            primary: '#1f2937',
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
          h2: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h5: {
            fontWeight: 700,
          },
          body1: {
            fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
          },
          body2: {
            fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
          },
        },
      }),
    []
  )

  const inStockCount = pets.filter(p => p.available).length

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch('/api/pets')
      .then(async r => {
        if (!r.ok) {
          throw new Error(`Request failed with status ${r.status}`)
        }

        return r.json()
      })
      .then(data => setPets(Array.isArray(data) ? data : []))
      .catch(err => {
        setError(err.message || 'Unable to load pets')
        setPets([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
          <Box className="hero-glow" />
          <Box
            sx={{
              position: 'relative',
              borderRadius: 6,
              p: { xs: 3, md: 5 },
              mb: 4,
              background:
                'linear-gradient(120deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 241, 228, 0.92) 100%)',
              border: '1px solid rgba(194, 65, 12, 0.15)',
              boxShadow: '0 20px 60px rgba(53, 28, 13, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="overline"
              sx={{
                letterSpacing: '0.14em',
                color: '#9a3412',
                fontWeight: 700,
                display: 'block',
                mb: 1,
              }}
            >
              Petstore Catalog
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.25rem' }, mb: 1.5 }}>
              Find your next favorite companion
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: 680, color: 'rgba(31, 41, 55, 0.85)', mb: 2.5, fontSize: '1.05rem' }}
            >
              Browse healthy, socialized pets across dogs, cats, birds, and fish. Each profile includes
              a short description, availability, and current price.
            </Typography>

            <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
              <Chip label={`${pets.length} pets listed`} sx={{ fontWeight: 700 }} />
              <Chip label={`${inStockCount} in stock`} color="primary" sx={{ fontWeight: 700 }} />
              <Chip label="Ready for pickup" sx={{ fontWeight: 700 }} />
            </Stack>
          </Box>

          {loading && (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <CircularProgress size={36} />
              <Typography variant="body1">Loading pets...</Typography>
            </Stack>
          )}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-message': { width: '100%' },
              }}
              action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            >
              Could not load pets from the API. {error}
            </Alert>
          )}

          {!loading && !error && (
            <Grid container spacing={2.2}>
              {pets.map((p, index) => {
                const typeColor = PET_TYPE_COLORS[p.type] || '#ea580c'

                return (
                  <Grid item key={p.id} xs={12} sm={6} lg={4}>
                    <Card
                      className="pet-card"
                      sx={{
                        height: '100%',
                        border: '1px solid rgba(194, 65, 12, 0.14)',
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          background: `linear-gradient(90deg, ${typeColor} 0%, rgba(255,255,255,0.8) 100%)`,
                        }}
                      />
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="h5" sx={{ fontSize: '1.15rem' }}>
                            {p.name}
                          </Typography>
                          <Chip
                            label={p.type}
                            size="small"
                            sx={{
                              bgcolor: `${typeColor}1a`,
                              color: typeColor,
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'rgba(55, 65, 81, 0.9)', minHeight: 48, mb: 2 }}>
                          {p.description}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
                            ${Number(p.price).toFixed(2)}
                          </Typography>
                          <Chip
                            label={p.available ? 'Available' : 'Unavailable'}
                            color={p.available ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}
