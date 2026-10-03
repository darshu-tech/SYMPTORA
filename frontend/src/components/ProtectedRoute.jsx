import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children }) {

  const {
    user,
    isLoading
  } = useAuth();


  if (isLoading) {

    return (

      <div className="auth-loading-screen">

        <div className="auth-loading-orbit">
          <span>S</span>
        </div>

        <p>
          Restoring your secure session...
        </p>

      </div>

    );

  }


  if (!user) {
    return null;
  }


  return children;

}


export default ProtectedRoute;
