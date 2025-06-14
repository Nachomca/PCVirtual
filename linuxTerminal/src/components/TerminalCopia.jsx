import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import '../styles/global.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const [currentPath, setCurrentPath] = useState("/");
  const [mode, setMode] = useState('kali'); // <-- Modo actual
  const xtermRef = useRef(null);
  const getPrompt = () => {
    const relativePath = currentPath === '/' ? '~' : `~${currentPath}`;
    return `nacho@pcvirtual:${relativePath}$ `;
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
      foreground: '#c9d1d9',
      cursor: '#c9d1d9',
    },
    hacker: {
      background: '#000000',
      foreground: '#00FF00',
      cursor: '#00FF00',
    }
  };
  
  useEffect(() => {
    const term = new Terminal({
      cols: 80,
      rows: 24,
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
          const dir = getDirFromPath(currentPath);
          if (dir && typeof dir === 'object') {
            const entries = Object.keys(dir);
            if (entries.length === 0) term.writeln("Directorio vacío.");
            else term.writeln(entries.join('  '));;
          } else {
            term.writeln("No se puede listar este directorio.");
          }
          break;
        }

        case 'cd': {
          if (args.length === 0) {
            setCurrentPath('/');
          } else {
            const newPath = normalizePath(args[0].startsWith('/') ? args[0] : currentPath + '/' + args[0]);
            const dir = getDirFromPath(newPath);
            if (dir && typeof dir === 'object') {
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
      } else {
        currentCommand += data;
        term.write(data);
      }
    });

    return () => {
      term.dispose();
    };
  }, [currentPath, mode]);

  return (
    <div className={`flex flex-col items-center justify-start terminal-container ${mode === 'kali' ? 'kali-mode' : 'hacker-mode'}`}>
      {/* Botones arriba centrados */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode('kali')}
          className="bg-gray-800 text-white px-4 py-1 rounded hover:bg-gray-600"
        >
          Modo Kali
        </button>
        <button
          onClick={() => setMode('hacker')}
          className="bg-green-900 text-green-300 px-4 py-1 rounded hover:bg-green-700"
        >
          Modo Hacker
        </button>
      </div>

      {/* Terminal */}
      <div
        ref={terminalRef}
        className="w-full h-[500px] border border-gray-700 rounded overflow-hidden"
      />
    </div>
  );
};

export default TerminalComponent;
