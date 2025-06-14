import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import '../styles/global.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const currentPathRef = useRef("/");
  const [currentPath, setCurrentPath] = useState("/");
  const [mode, setMode] = useState('kali'); // <-- Modo actual
  const xtermRef = useRef(null);
  const getPrompt = () => {
    const path = currentPathRef.current;
    const relativePath = path === '/' ? '~' : `~${path}`;
    const color =
    mode === 'hacker'
      ? '\x1b[32m' // Verde
      : '\x1b[38;5;33m'; // Azul (Kali)

    const reset = '\x1b[0m';
    return `${color}nacho@pcvirtual:${relativePath}$ ${reset}`;
  };

  // Estructura de sistema de archivos como árbol real
  const fileSystem = {
    bin: {
        ls: {},
        cd:{},
        clear:{},
        bash:{}
      },
    sbin: {
        reebot: {}
    },
    etc: {
        passwd: {
            root: {},
            nacho: {}
        },
        ssh: {},
        hosts: {},
        network: {}
    },
    home: {
        nacho: {
            documents: {
                nmap: {
                    "readme.md": "Este es el archivo de documentación de Nmap."
                },
                metaexploite: {
                    "readme.md": "Este es el archivo de documentación de ME"
                }
            },
            hacking: {},
            downloads: {},
            media:{},
            bashrc:{},
            gitconfig:{},
            vscode: {}
        }
    },
    usr: {
        bin: {
            firefox: {},
            python3: {},
        },
        lib:{},
        share:{
            fonts:{},
            man:{}
        }
    },
    var: {
        log: {
          syslog: {},
          authlog: {},
        },
        lib:{
            mysql:{}
        },
        spool:{}
    },
    temp: {
        vscodestdoutlog: {},
        X11unix: {}
    },
    opt: {
        jetbrainstoolbox: {},
        androidstudio: {},
        discord: {}
    },
    dev: {
        sda: {},
        null: {}
    },
    proc: {
        cpuinfo: {},
        meminfo: {},
        uptime: {},
        pid:{}
    }
  };

  // Convierte una ruta a su objeto dentro del árbol
  const getDirFromPath = (path) => {
    const parts = path.split('/').filter(Boolean);
    let dir = fileSystem;
    for (const part of parts) {
      if (dir[part]) {
        dir = dir[part];
      } else {
        return null;
      }
    }
    return dir;
  };

  // Limpia y normaliza la ruta
  const normalizePath = (path) => {
    const stack = [];
    const parts = path.split('/');

    for (let part of parts) {
      if (part === '' || part === '.') continue;
      if (part === '..') {
        if (stack.length) stack.pop();
      } else {
        stack.push(part);
      }
    }

    return '/' + stack.join('/');
  };

  const themes = {
    kali: {
      background: '#0d1117',
      foreground: '#f8f8f2',
      cursor: '#ff5555',
      selection: '#44475a',
    },
    hacker: {
      background: '#000000',
      foreground: '#00ff00',
      cursor: '#00ff00',
      selection: '#003300',
    },
  };    

  const findMatches = (path, prefix) => {
    const dir = getDirFromPath(path);
    if (!dir || typeof dir !== 'object') return [];
  
    return Object.keys(dir).filter(entry => entry.startsWith(prefix));
  };  
  
  useEffect(() => {
    const term = new Terminal({
      cols: 110,
      rows: 26,
      theme: themes[mode],
      cursorBlink: true,
    });

    xtermRef.current = term;
    term.open(terminalRef.current);
    term.writeln("Bienvenido a la terminal Linux simulada.");
    term.write(getPrompt());
    term.focus();

    let currentCommand = '';
    
    const executeCommand = (cmd) => {
      const [command, ...args] = cmd.trim().split(' ');

      switch (command) {
        case 'ls': {
            let pathToList;
          
            if (args.length === 0) {
              pathToList = currentPath;
            } else {
              const inputPath = args[0];
              pathToList = inputPath.startsWith('/')
                ? inputPath
                : currentPath === '/'
                ? `/${inputPath}`
                : `${currentPath}/${inputPath}`;
            }
          
            const dir = getDirFromPath(pathToList);
          
            if (dir && typeof dir === 'object') {
              const entries = Object.entries(dir);
              if (entries.length === 0) {
                term.writeln('Directorio vacío.');
              } else {
                const formatted = entries.map(([name, value]) => {
                  if (typeof value === 'object') {
                    // carpeta
                    return mode === 'kali' ? `\x1b[34m${name}\x1b[0m` : name;
                  } else if (name.endsWith('.md')) {
                    return mode === 'kali' ? `\x1b[33m${name}\x1b[0m` : name;
                  } else {
                    return name;
                  }
                });
                term.writeln(formatted.join('  '));
              }
            } else {
              term.writeln(`No se puede acceder a "${pathToList}"`);
            }
          
            break;
          }                    

        case 'cd': {
          if (args.length === 0) {
            setCurrentPath('/');
          } else {
            const newPath = normalizePath(args[0].startsWith('/') ? args[0] : currentPathRef.current + '/' + args[0]);
            const dir = getDirFromPath(newPath);
            if (dir && typeof dir === 'object') {
                currentPathRef.current = newPath;
                setCurrentPath(newPath);
            } else {
              term.writeln("Directorio no encontrado.");
            }
          }
          break;
        }

        case 'clear': {
          term.clear();
          break;
        }

        default:
          if (cmd.trim() !== '') term.writeln("Comando no reconocido.");
      }
    };

    term.onData((data) => {
      if (data === '\r') {
        term.writeln('');
        executeCommand(currentCommand);
        currentCommand = '';
        term.write(getPrompt());
        term.focus();
      } else if (data === '\u007F') {
        // backspace
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\t') {
        const parts = currentCommand.trim().split(' ');
        const cmd = parts[0];
        const lastPart = parts[parts.length - 1];
      
        // Soporte para 'cd' y 'ls'
        if (cmd === 'cd' || cmd === 'ls') {
          let basePath = currentPathRef.current;
          let prefix = '';
      
          if (parts.length === 2 && lastPart.includes('/')) {
            const pathParts = lastPart.split('/');
            prefix = pathParts.pop();
            const relativePath = pathParts.join('/');
            basePath = relativePath.startsWith('/')
              ? normalizePath(relativePath)
              : normalizePath(`${currentPathRef.current}/${relativePath}`);
          } else {
            prefix = lastPart;
          }
      
          const matches = findMatches(basePath, prefix);
      
          if (matches.length === 1) {
            // Autocompletar
            const completed = lastPart.includes('/')
              ? lastPart.replace(/[^/]*$/, matches[0])
              : matches[0];
      
            parts[parts.length - 1] = completed;
            currentCommand = parts.join(' ');
            term.write(`\r${getPrompt()}${currentCommand}`);
          } else if (matches.length > 1) {
            term.writeln('');
            term.writeln(matches.join('  '));
            term.write(getPrompt() + currentCommand);
          }
        }
      } else if (data.charCodeAt(0) >= 32) {
        // Solo permitir caracteres imprimibles (evita borrar el prompt o insertar control chars)
        currentCommand += data;
        term.write(data);
      }
    });

    return () => {
      term.dispose();
    };
  }, [mode]);

  return (
    <div className={`flex flex-col items-center justify-start terminal-container py-8 px-4 ${mode === 'kali' ? 'kali-mode' : 'hacker-mode'}`}>
      
      {/* Botones arriba centrados */}
      <div className="flex space-x-4 mt-12 mb-12">
        <button
          onClick={() => setMode('kali')}
          className={`px-4 py-2 rounded shadow ${
            mode === 'kali'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-600'
          }`}
        >
          Modo Kali
        </button>
        <button
          onClick={() => setMode('hacker')}
          className={`px-4 py-2 rounded shadow ${
            mode === 'hacker'
              ? 'bg-green-800 text-green-300'
              : 'bg-green-900 text-green-300 hover:bg-green-700'
          }`}
        >
          Modo Hacker
        </button>
      </div>
  
      {/* Terminal */}
      <div
        ref={terminalRef}
        className="w-full max-w-5xl h-[500px] border border-gray-700 rounded overflow-hidden shadow-lg"
      />
    </div>
  );  
};

export default TerminalComponent;
