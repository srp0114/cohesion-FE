import React ,{ useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const Loading = ({ delayTime = 3000 }: { delayTime?: number }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef<number | null>(null);
  
    useEffect(() => {
      timerRef.current = window.setTimeout(() => {
        navigate(location.state?.from || "/");
      }, delayTime);
  
      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, [navigate]);
    return (
        <div className="contentWrap">
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <HashLoader
                    color="#0047bb"
                    loading
                    size={88}
                />
            </div>
        </div>
    );
}

export default Loading;