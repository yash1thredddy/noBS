import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion } from "motion/react";
import companyLogo from 'figma:asset/3719964460fd60c11f6876da44f351cf07902b42.png';

import { getOrcidAuthUrl } from '../utils/auth';
import { shouldForceReauth } from '../stores/authStore';

export function LoginPage() {
  const handleOrcidLogin = () => {
    // Check if user just logged out - force re-authentication
    const forcePrompt = shouldForceReauth();
    
    // Get ORCID authorization URL with proper configuration
    const authUrl = getOrcidAuthUrl(forcePrompt);
    
    if (authUrl === '#') {
      console.error('❌ ORCID configuration missing!');
      alert('⚠️ ORCID configuration missing! Please create .env file in frontend/ directory.');
      return;
    }
    
    // Redirect to ORCID for authentication
    window.location.href = authUrl;
  };

  // Complex protein/chemical structures
  const molecules = [
    { 
      atoms: [
        { x: 40, y: 0 }, { x: 80, y: 20 }, { x: 80, y: 60 }, 
        { x: 40, y: 80 }, { x: 0, y: 60 }, { x: 0, y: 20 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 18,
      delay: 0,
      left: '5%',
      top: '10%',
      scale: 1.2
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 100, y: 25 }, { x: 100, y: 75 }, 
        { x: 50, y: 100 }, { x: 0, y: 75 }, { x: 0, y: 25 },
        { x: 30, y: 50 }, { x: 70, y: 50 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [6,7], [5,6], [1,7]],
      duration: 22,
      delay: 2,
      left: '80%',
      top: '15%',
      scale: 1.5
    },
    { 
      atoms: [
        { x: 60, y: 10 }, { x: 110, y: 30 }, { x: 110, y: 80 }, 
        { x: 60, y: 100 }, { x: 10, y: 80 }, { x: 10, y: 30 },
        { x: 60, y: 55 }, { x: 85, y: 40 }, { x: 85, y: 70 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [2,6], [1,7], [7,8], [8,2]],
      duration: 20,
      delay: 4,
      left: '15%',
      top: '70%',
      scale: 1.3
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 90, y: 30 }, { x: 90, y: 70 }, 
        { x: 50, y: 100 }, { x: 10, y: 70 }, { x: 10, y: 30 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,3], [1,4], [2,5]],
      duration: 19,
      delay: 1,
      left: '70%',
      top: '60%',
      scale: 1.1
    },
    { 
      atoms: [
        { x: 30, y: 0 }, { x: 70, y: 0 }, { x: 100, y: 40 }, 
        { x: 80, y: 80 }, { x: 40, y: 90 }, { x: 0, y: 50 },
        { x: 50, y: 30 }, { x: 50, y: 60 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [1,6], [6,7], [3,7], [4,7]],
      duration: 21,
      delay: 3,
      left: '25%',
      top: '25%',
      scale: 1.4
    },
    { 
      atoms: [
        { x: 40, y: 5 }, { x: 75, y: 5 }, { x: 95, y: 35 }, 
        { x: 95, y: 65 }, { x: 75, y: 95 }, { x: 40, y: 95},
        { x: 20, y: 65 }, { x: 20, y: 35 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0]],
      duration: 23,
      delay: 5,
      left: '60%',
      top: '35%',
      scale: 1.2
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 100, y: 30 }, { x: 90, y: 80 }, 
        { x: 40, y: 100 }, { x: 0, y: 70 }, { x: 10, y: 30 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 17,
      delay: 6,
      left: '10%',
      top: '45%',
      scale: 1.0
    },
    { 
      atoms: [
        { x: 60, y: 0 }, { x: 120, y: 20 }, { x: 120, y: 60 }, 
        { x: 80, y: 90 }, { x: 40, y: 90 }, { x: 0, y: 60 },
        { x: 0, y: 20 }, { x: 60, y: 45 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0], [0,7], [2,7], [4,7], [6,7]],
      duration: 24,
      delay: 7,
      left: '85%',
      top: '50%',
      scale: 1.6
    },
    { 
      atoms: [
        { x: 50, y: 10 }, { x: 90, y: 30 }, { x: 90, y: 70 }, 
        { x: 50, y: 90 }, { x: 10, y: 70 }, { x: 10, y: 30 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 16,
      delay: 2,
      left: '40%',
      top: '5%',
      scale: 0.9
    },
    { 
      atoms: [
        { x: 45, y: 0 }, { x: 85, y: 15 }, { x: 95, y: 55 }, 
        { x: 70, y: 85 }, { x: 30, y: 85 }, { x: 5, y: 55 },
        { x: 15, y: 15 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0], [0,3], [1,4], [2,5]],
      duration: 20,
      delay: 8,
      left: '50%',
      top: '75%',
      scale: 1.3
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 95, y: 25 }, { x: 95, y: 75 }, 
        { x: 50, y: 100 }, { x: 5, y: 75 }, { x: 5, y: 25 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 18,
      delay: 4,
      left: '90%',
      top: '80%',
      scale: 1.1
    },
    { 
      atoms: [
        { x: 40, y: 0 }, { x: 80, y: 10 }, { x: 100, y: 45 }, 
        { x: 80, y: 80 }, { x: 40, y: 90 }, { x: 10, y: 60 },
        { x: 10, y: 30 }, { x: 50, y: 45 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0], [7,0], [7,2], [7,4], [7,6]],
      duration: 22,
      delay: 1,
      left: '32%',
      top: '85%',
      scale: 1.4
    },
    { 
      atoms: [
        { x: 60, y: 5 }, { x: 110, y: 30 }, { x: 110, y: 80 }, 
        { x: 60, y: 105 }, { x: 10, y: 80 }, { x: 10, y: 30 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,2], [1,3], [2,4], [3,5], [4,0], [5,1]],
      duration: 25,
      delay: 9,
      left: '68%',
      top: '8%',
      scale: 1.5
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 100, y: 30 }, { x: 90, y: 80 }, 
        { x: 40, y: 95 }, { x: 0, y: 65 }, { x: 10, y: 30 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 19,
      delay: 5,
      left: '5%',
      top: '88%',
      scale: 1.0
    },
    { 
      atoms: [
        { x: 55, y: 10 }, { x: 95, y: 35 }, { x: 85, y: 75 }, 
        { x: 45, y: 90 }, { x: 15, y: 65 }, { x: 15, y: 35 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 21,
      delay: 6,
      left: '78%',
      top: '90%',
      scale: 1.2
    },
    { 
      atoms: [
        { x: 50, y: 0 }, { x: 90, y: 20 }, { x: 100, y: 60 }, 
        { x: 70, y: 90 }, { x: 30, y: 90 }, { x: 0, y: 60 },
        { x: 10, y: 20 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0]],
      duration: 20,
      delay: 3,
      left: '45%',
      top: '40%',
      scale: 1.1
    },
    { 
      atoms: [
        { x: 60, y: 0 }, { x: 105, y: 25 }, { x: 105, y: 75 }, 
        { x: 60, y: 100 }, { x: 15, y: 75 }, { x: 15, y: 25 }
      ],
      bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      duration: 18,
      delay: 7,
      left: '92%',
      top: '30%',
      scale: 1.3
    },
  ];

  // Smaller background molecules
  const smallMolecules = Array.from({ length: 25 }, () => ({
    size: 30 + Math.random() * 40,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 10,
  }));

  // Glowing orbs
  const orbs = [
    { size: 500, color: "rgba(166, 206, 57, 0.2)", duration: 30, delay: 0, x: -100, y: -100 },
    { size: 450, color: "rgba(74, 222, 128, 0.15)", duration: 35, delay: 5, x: 120, y: 100 },
    { size: 400, color: "rgba(34, 197, 94, 0.18)", duration: 28, delay: 10, x: -80, y: 120 },
    { size: 350, color: "rgba(132, 204, 22, 0.15)", duration: 32, delay: 3, x: 100, y: -80 },
  ];

  // Protein docking animations
  const proteinDockingPairs = [
    {
      ligand: {
        atoms: [
          { x: 20, y: 20 }, { x: 40, y: 10 }, { x: 60, y: 20 }, { x: 60, y: 40 }, { x: 40, y: 50 }, { x: 20, y: 40 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
      },
      receptor: {
        atoms: [
          { x: 30, y: 0 }, { x: 70, y: 0 }, { x: 90, y: 30 }, { x: 90, y: 70 },
          { x: 70, y: 100 }, { x: 30, y: 100 }, { x: 10, y: 70 }, { x: 10, y: 30 },
          { x: 50, y: 30 }, { x: 50, y: 70 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [0,8], [2,8], [8,9], [4,9], [6,9]],
      },
      startX: '10%',
      startY: '20%',
      duration: 15,
      delay: 0,
    },
    {
      ligand: {
        atoms: [
          { x: 25, y: 15 }, { x: 45, y: 15 }, { x: 55, y: 35 }, { x: 45, y: 55 }, { x: 25, y: 55 }, { x: 15, y: 35 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,3]],
      },
      receptor: {
        atoms: [
          { x: 40, y: 5 }, { x: 80, y: 5 }, { x: 100, y: 40 }, { x: 80, y: 75 },
          { x: 40, y: 75 }, { x: 20, y: 40 }, { x: 60, y: 25 }, { x: 60, y: 55 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [1,6], [6,7], [3,7], [4,7]],
      },
      startX: '75%',
      startY: '65%',
      duration: 18,
      delay: 5,
    },
    {
      ligand: {
        atoms: [
          { x: 30, y: 20 }, { x: 50, y: 10 }, { x: 70, y: 20 }, { x: 70, y: 50 }, { x: 50, y: 60 }, { x: 30, y: 50 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],
      },
      receptor: {
        atoms: [
          { x: 35, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 75 },
          { x: 75, y: 110 }, { x: 35, y: 110 }, { x: 10, y: 75 }, { x: 10, y: 35 },
          { x: 55, y: 35 }, { x: 55, y: 75 }
        ],
        bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,8], [8,9], [5,9]],
      },
      startX: '45%',
      startY: '10%',
      duration: 20,
      delay: 10,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-emerald-950">
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-emerald-500/10 to-lime-500/20 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/10 via-green-600/10 to-lime-600/15 animate-pulse-slower" />
      
      {/* Large glowing orbs */}
      {orbs.map((orb, index) => (
        <motion.div
          key={`orb-${index}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
          }}
          animate={{
            x: [orb.x, -orb.x, orb.x],
            y: [orb.y, -orb.y, orb.y],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
          initial={{
            x: orb.x,
            y: orb.y,
            left: `${10 + index * 20}%`,
            top: `${15 + index * 20}%`,
          }}
        />
      ))}

      {/* Complex molecular structures */}
      {molecules.map((molecule, molIndex) => (
        <motion.div
          key={`molecule-${molIndex}`}
          className="absolute opacity-30"
          style={{
            left: molecule.left,
            top: molecule.top,
            filter: 'drop-shadow(0 0 8px rgba(166, 206, 57, 0.3))',
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: molecule.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: molecule.delay,
          }}
        >
          <svg width={120 * molecule.scale} height={120 * molecule.scale} viewBox="0 0 120 120">
            {molecule.bonds.map((bond, bondIndex) => (
              <g key={`bond-${bondIndex}`}>
                <line
                  x1={molecule.atoms[bond[0]].x + 10}
                  y1={molecule.atoms[bond[0]].y + 10}
                  x2={molecule.atoms[bond[1]].x + 10}
                  y2={molecule.atoms[bond[1]].y + 10}
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  opacity="0.8"
                />
              </g>
            ))}
            {molecule.atoms.map((atom, atomIndex) => (
              <g key={`atom-${atomIndex}`}>
                <circle
                  cx={atom.x + 10}
                  cy={atom.y + 10}
                  r="8"
                  fill="url(#gradient2)"
                  opacity="0.9"
                />
                <circle
                  cx={atom.x + 10}
                  cy={atom.y + 10}
                  r="4"
                  fill="#ffffff"
                  opacity="0.6"
                />
              </g>
            ))}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A6CE39" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <radialGradient id="gradient2">
                <stop offset="0%" stopColor="#A6CE39" />
                <stop offset="100%" stopColor="#22c55e" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Small floating molecules */}
      {smallMolecules.map((mol, index) => (
        <motion.div
          key={`small-mol-${index}`}
          className="absolute"
          style={{
            left: mol.left,
            top: mol.top,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: mol.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: mol.delay,
          }}
        >
          <svg width={mol.size} height={mol.size} viewBox="0 0 40 40">
            <circle cx="20" cy="8" r="4" fill="#A6CE39" opacity="0.6" />
            <circle cx="32" cy="20" r="4" fill="#4ade80" opacity="0.6" />
            <circle cx="20" cy="32" r="4" fill="#22c55e" opacity="0.6" />
            <circle cx="8" cy="20" r="4" fill="#84cc16" opacity="0.6" />
            <line x1="20" y1="8" x2="32" y2="20" stroke="#A6CE39" strokeWidth="2" opacity="0.4" />
            <line x1="32" y1="20" x2="20" y2="32" stroke="#A6CE39" strokeWidth="2" opacity="0.4" />
            <line x1="20" y1="32" x2="8" y2="20" stroke="#A6CE39" strokeWidth="2" opacity="0.4" />
            <line x1="8" y1="20" x2="20" y2="8" stroke="#A6CE39" strokeWidth="2" opacity="0.4" />
          </svg>
        </motion.div>
      ))}

      {/* Floating particles with glow */}
      {[...Array(40)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${
              ['#A6CE39', '#4ade80', '#22c55e', '#84cc16'][Math.floor(Math.random() * 4)]
            }, transparent)`,
            boxShadow: `0 0 10px ${
              ['#A6CE39', '#4ade80', '#22c55e', '#84cc16'][Math.floor(Math.random() * 4)]
            }`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* DNA helix strands */}
      {[...Array(3)].map((_, helixIndex) => (
        <motion.div
          key={`helix-${helixIndex}`}
          className="absolute opacity-20"
          style={{
            left: `${20 + helixIndex * 30}%`,
            top: '0%',
          }}
          animate={{
            y: [0, 100, 0],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 25 + helixIndex * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width="60" height="200" viewBox="0 0 60 200">
            <path
              d="M 10 0 Q 30 25 10 50 Q -10 75 10 100 Q 30 125 10 150 Q -10 175 10 200"
              stroke="#A6CE39"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 50 0 Q 30 25 50 50 Q 70 75 50 100 Q 30 125 50 150 Q 70 175 50 200"
              stroke="#4ade80"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="10"
                y1={i * 25 + 12}
                x2="50"
                y2={i * 25 + 12}
                stroke="#22c55e"
                strokeWidth="2"
                opacity="0.4"
              />
            ))}
          </svg>
        </motion.div>
      ))}

      {/* Protein docking animations */}
      {proteinDockingPairs.map((pair, index) => (
        <motion.div
          key={`protein-docking-${index}`}
          className="absolute opacity-30"
          style={{
            left: pair.startX,
            top: pair.startY,
            filter: 'drop-shadow(0 0 8px rgba(166, 206, 57, 0.3))',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: pair.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pair.delay,
          }}
        >
          <svg width={150} height={150} viewBox="0 0 120 120">
            {pair.ligand.bonds.map((bond, bondIndex) => (
              <g key={`ligand-bond-${bondIndex}`}>
                <line
                  x1={pair.ligand.atoms[bond[0]].x}
                  y1={pair.ligand.atoms[bond[0]].y}
                  x2={pair.ligand.atoms[bond[1]].x}
                  y2={pair.ligand.atoms[bond[1]].y}
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  opacity="0.8"
                />
              </g>
            ))}
            {pair.ligand.atoms.map((atom, atomIndex) => (
              <g key={`ligand-atom-${atomIndex}`}>
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r="6"
                  fill="url(#gradient2)"
                  opacity="0.9"
                />
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r="3"
                  fill="#ffffff"
                  opacity="0.6"
                />
              </g>
            ))}
            {pair.receptor.bonds.map((bond, bondIndex) => (
              <g key={`receptor-bond-${bondIndex}`}>
                <line
                  x1={pair.receptor.atoms[bond[0]].x}
                  y1={pair.receptor.atoms[bond[0]].y}
                  x2={pair.receptor.atoms[bond[1]].x}
                  y2={pair.receptor.atoms[bond[1]].y}
                  stroke="url(#gradient3)"
                  strokeWidth="3"
                  opacity="0.8"
                />
              </g>
            ))}
            {pair.receptor.atoms.map((atom, atomIndex) => (
              <g key={`receptor-atom-${atomIndex}`}>
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r="6"
                  fill="url(#gradient4)"
                  opacity="0.9"
                />
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r="3"
                  fill="#ffffff"
                  opacity="0.6"
                />
              </g>
            ))}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A6CE39" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <radialGradient id="gradient2">
                <stop offset="0%" stopColor="#A6CE39" />
                <stop offset="100%" stopColor="#22c55e" />
              </radialGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
              <radialGradient id="gradient4">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="w-full max-w-lg"
        >
          <Card className="w-full shadow-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-lime-500/20 border-2 border-green-400/30 relative overflow-hidden">
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
            
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />

            <CardHeader className="space-y-8 text-center pb-10 pt-12 relative z-10">
              <motion.div 
                className="flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3 
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl bg-green-400/50 animate-pulse" />
                  <img 
                    src={companyLogo} 
                    alt="noBS Company Logo" 
                    className="h-24 w-auto object-contain relative z-10 mix-blend-screen"
                    style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <CardTitle className="text-4xl text-white drop-shadow-lg">Welcome Back</CardTitle>
                <CardDescription className="text-base text-green-100">
                  Sign in to your account using your ORCID credentials
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Button 
                  onClick={handleOrcidLogin}
                  className="w-full h-16 bg-gradient-to-r from-[#A6CE39] to-[#84cc16] hover:from-[#92B830] hover:to-[#65a30d] text-white transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 relative overflow-hidden group"
                  size="lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  <svg 
                    viewBox="0 0 256 256" 
                    className="w-10 h-10 mr-3 relative z-10 drop-shadow-lg"
                    fill="white"
                  >
                    <path d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"/>
                    <g>
                      <path fill="#A6CE39" d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"/>
                      <path fill="#A6CE39" d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"/>
                      <path fill="#A6CE39" d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1C84.2,46.7,88.7,51.3,88.7,56.8"/>
                    </g>
                  </svg>
                  <span className="text-xl relative z-10">Sign in with ORCID</span>
                </Button>
              </motion.div>
              
              <motion.div 
                className="text-center text-sm text-green-100 pt-6 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center justify-center gap-4">
                  <a href="#" className="hover:text-white transition-colors drop-shadow">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-white transition-colors drop-shadow">
                    Privacy Policy
                  </a>
                </div>
                <p className="text-xs text-green-200">© 2024 noBS Consortium</p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Information footer */}
      <motion.div 
        className="absolute bottom-6 left-0 right-0 text-center text-sm text-green-300/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="drop-shadow-lg">Secure Natural Products Research Platform</p>
      </motion.div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}