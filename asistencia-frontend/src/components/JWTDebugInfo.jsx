import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const JWTDebugInfo = () => {
  const { user, getToken, isTokenExpired } = useAuthContext();
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  const token = getToken();
  let decodedToken = null;
  let tokenInfo = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const issuedDate = new Date(decodedToken.iat * 1000);
      const currentDate = new Date();
      const timeUntilExpiry = expirationDate.getTime() - currentDate.getTime();
      
      tokenInfo = {
        isExpired: isTokenExpired(),
        expirationDate: expirationDate.toLocaleString(),
        issuedDate: issuedDate.toLocaleString(),
        timeUntilExpiry: Math.max(0, Math.floor(timeUntilExpiry / 1000 / 60)), // minutos
        tokenLength: token.length
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
    }
  }

  if (!showDebug) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={() => setShowDebug(true)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          title="Mostrar información JWT (Solo desarrollo)"
        >
          🔍
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px'
      }}>
        <strong>🔍 JWT Debug Info</strong>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Estado de Autenticación:</strong>
        <br />
        {user ? (
          <span style={{ color: '#28a745' }}>✅ Autenticado</span>
        ) : (
          <span style={{ color: '#dc3545' }}>❌ No autenticado</span>
        )}
      </div>

      {user && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Usuario Actual:</strong>
          <br />
          Email: {user.email}
          <br />
          Tipo: {user.userType}
          <br />
          ID: {user.id}
        </div>
      )}

      {token && tokenInfo && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Información del Token:</strong>
          <br />
          Estado: {tokenInfo.isExpired ? 
            <span style={{ color: '#dc3545' }}>❌ Expirado</span> : 
            <span style={{ color: '#28a745' }}>✅ Válido</span>
          }
          <br />
          Expira: {tokenInfo.expirationDate}
          <br />
          Emitido: {tokenInfo.issuedDate}
          <br />
          Tiempo restante: {tokenInfo.timeUntilExpiry} min
          <br />
          Longitud: {tokenInfo.tokenLength} chars
        </div>
      )}

      {decodedToken && (
        <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Ver Token Decodificado
          </summary>
          <pre style={{
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '10px',
            overflow: 'auto',
            maxHeight: '200px',
            marginTop: '5px'
          }}>
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default JWTDebugInfo; 