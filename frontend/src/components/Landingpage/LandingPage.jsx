import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingAnimation from "../Components/Animations/loadingAnimation.json"; 


const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      // Redirect to login if tokens are not present
      navigate('/Login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const role = user.acclevel;

      // Simulate delay if needed (optional)
      setTimeout(() => {
        switch (role) {
          case 1:
            navigate('/Dashboard');
            break;
          case 2:
            navigate('/TeacherDashboard');
            break;
          case 3:
            navigate('/admin');
            break;
          default:
            navigate('/Login');
        }
      }, 1500); // 1.5 seconds delay to show animation
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/Login');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-80">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
        <p className="text-center text-gray-600 mt-4">Redirecting...</p>
      </div>
    </div>
  );
};

export default LandingPage;
