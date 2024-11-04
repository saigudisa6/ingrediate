import { AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Camera, ChevronRight, User, Lock, Loader2, ArrowRight, Mail, UserPlus } from 'lucide-react';
import bannerPNG from '../public/kitchenBanner.png';
import styles from './styles/Home.module.css';
import Link from 'next/link';


const HomePage = () => {
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [isHovered, setIsHovered] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.homePage}>
      <div className={styles.titleTagLine}>
        <h1 className={styles.title}>
          Ingrediate
        </h1>
        <p className={styles.tagLine}>
          Turning Nothing, Into Something.
        </p>
      </div>
      
      <div className={styles.selectionMenu} style={{
        transform: (isLoginClicked || isSignUpClicked) ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.5s ease'
      }}>
        <Link href='/api/auth/login' style={{textDecoration:'none'}}>
          <button 
              onMouseEnter={() => setIsHovered('login')}
              onMouseLeave={() => setIsHovered('')}
              className={styles.buttonBaseStyle}
              style={{
                backgroundColor: isLoginClicked ? '#000000' : '#D3D3C7',
                color: isLoginClicked ? '#FFFFFF' : '#000000',
                transform: isLoginClicked 
                  ? 'scale(0.95)' 
                  : isHovered === 'login' 
                    ? 'scale(1.10)' 
                    : 'scale(1)',
                boxShadow: isHovered === 'login' 
                  ? '0 6px 20px rgba(0, 0, 0, 0.15)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    Login
                  </span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
        </Link>
        <Link href='/api/auth/signup'>
          <button 
              onMouseEnter={() => setIsHovered('signup')}
              onMouseLeave={() => setIsHovered('')}
              className={styles.buttonBaseStyle}
              style={{
                backgroundColor: isSignUpClicked ? '#000000' : '#D3D3C7',
                color: isSignUpClicked ? '#FFFFFF' : '#000000',
                transform: isSignUpClicked 
                  ? 'scale(0.95)' 
                  : isHovered === 'signup' 
                    ? 'scale(1.10)' 
                    : 'scale(1)',
                boxShadow: isHovered === 'signup' 
                  ? '0 6px 20px rgba(0, 0, 0, 0.15)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    Sign Up
                  </span>
                  <UserPlus size={20} />
                </>
              )}
            </button>
        
        </Link>
          
        
      </div>
      <div className="w-full mt-auto">
          <img src={'.kitchenBanner.png'} alt="Banner" className="w-full h-auto" style={{ objectFit: 'cover' }} />
        </div>
    </div>
  );
  
};

export default HomePage;
