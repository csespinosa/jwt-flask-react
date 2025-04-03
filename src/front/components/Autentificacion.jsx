import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Autentificacion = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    if (!store.auth || !store.auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const validateToken = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/validate-token", {
          headers: {
            "Authorization": `Bearer ${store.auth.token}`
          }
        });
        
        if (!resp.ok) {
          dispatch({ type: 'logout' });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error validando token:", error);
        dispatch({ type: 'logout' });
        navigate("/login");
      }
    };
    
    validateToken();
  }, [store.auth, dispatch, navigate]);

  const handleLogout = () => {
    dispatch({ type: 'logout' });
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Área Privada</h2>
          {store.auth && store.auth.user && (
            <p className="card-text">Bienvenido {store.auth.user.email}</p>
          )}
          <p>Contenido visible solo para usuarios autenticados.</p>
          
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};