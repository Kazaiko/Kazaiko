import { useState, useEffect, useRef, useMemo } from "react";

const GIFT_KEY         = "xxxx-xxxx-xxxx-xxxx";
const ROMANTIC_MUSIC   = "/romantic.mp3";
const QUIZ_MUSIC       = "/quiz.mp3";
const BATMAN_MUSIC     = "/batman.mp3";
const THUNDER_SFX      = "/thunder.mp3";
const TRANSITION_IMAGE = "/batman-transition.png";
const GAME_COVER       = "/lego-batman-cover.png";

const PHASE_META = {
  click:      { title: "♥",                       favicon: "/favicon-heart.png"   },
  romantic:   { title: "feliz dia dos namorados",  favicon: "/favicon-heart.png"   },
  quiz:       { title: "? o charada ?",            favicon: "/favicon-question.png" },
  transition: { title: "...",                      favicon: "/favicon-bat.png"      },
  batman:     { title: "lego batman",              favicon: "/favicon-bat.png"      },
};

const QUIZ = [
  {
    question: "qual é o verdadeiro nome do batman?",
    options: ["clark kent", "bruce wayne", "barry allen", "oliver queen", "dick grayson"],
    answer: 1,
  },
  {
    question: "em qual cidade o batman protege?",
    options: ["metrópolis", "central city", "star city", "gotham city", "coast city"],
    answer: 3,
  },
  {
    question: "qual o nome do mordomo fiel do batman?",
    options: ["harold", "edwin", "alfred", "james", "lucius"],
    answer: 2,
  },
  {
    question: "qual veículo é o mais icônico do batman?",
    options: ["bat-moto", "bat-avião", "bat-submarino", "batmóvel", "bat-helicóptero"],
    answer: 3,
  },
  {
    question: "quem é o criador do batman nos quadrinhos?",
    options: ["stan lee", "jack kirby", "bob kane", "frank miller", "neil gaiman"],
    answer: 2,
  },
  {
    question: "você ama o criador desse site?",
    options: ["sim", "não"],
    answer: 0,
  },
];

function usePageMeta(phase) {
  useEffect(() => {
    const meta = PHASE_META[phase] ?? PHASE_META.click;
    document.title = meta.title;
    const el = document.getElementById("favicon");
    if (el) el.href = meta.favicon;
  }, [phase]);
}

function Cascade({ items }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none", overflow: "hidden", zIndex: 0,
    }}>
      {items.map((item) => (
        <span
          key={item.id}
          style={{
            position: "absolute",
            top: "-50px",
            left: item.left,
            fontSize: item.size,
            color: item.color,
            opacity: item.opacity,
            fontFamily: item.font ?? "inherit",
            animation: `fallDown ${item.duration} ${item.delay} infinite linear`,
            willChange: "transform",
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}

function useFallingHearts() {
  return useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left:     `${(i / 22) * 100 + (Math.random() - 0.5) * 4}%`,
      delay:    `${(i / 22) * -8}s`,
      duration: `${6 + (i % 5)}s`,
      size:     `${13 + (i % 4) * 5}px`,
      char:     i % 3 === 0 ? "♥" : "♡",
      color:    i % 2 === 0 ? "#e91e8c" : "#f48fb1",
      opacity:  0.45 + (i % 4) * 0.12,
    }))
  , []);
}

function useFallingQuestions() {
  return useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left:     `${(i / 24) * 100 + (Math.random() - 0.5) * 3}%`,
      delay:    `${(i / 24) * -9}s`,
      duration: `${6 + (i % 6)}s`,
      size:     `${14 + (i % 5) * 6}px`,
      char:     "?",
      color:    "#00ff41",
      opacity:  0.12 + (i % 5) * 0.04,
      font:     "'Bebas Neue', sans-serif",
    }))
  , []);
}

function useFlyingBats() {
  return useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top:      `${8 + (i / 10) * 78}%`,
      delay:    `${(i / 10) * -12}s`,
      duration: `${10 + (i % 5) * 2}s`,
      scale:    0.45 + (i % 4) * 0.22,
      flip:     i % 2 === 0,
    }))
  , []);
}

function FlyingBats() {
  const bats = useFlyingBats();
  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none", overflow: "hidden", zIndex: 0,
    }}>
      {bats.map((b) => (
        <svg
          key={b.id}
          viewBox="0 0 64 32"
          width={`${28 * b.scale}px`}
          style={{
            position: "absolute",
            top: b.top,
            left: "-60px",
            fill: "#1c1c1c",
            opacity: 0.5,
            animation: `flyBat ${b.duration} ${b.delay} infinite linear`,
            transform: b.flip ? "scaleX(-1)" : "none",
            willChange: "transform",
          }}
        >
          <path d="M32 14 C28 4 14 2 0 8 C8 10 14 14 16 18 C20 12 26 12 32 16 C38 12 44 12 48 18 C50 14 56 10 64 8 C50 2 36 4 32 14Z" />
          <ellipse cx="32" cy="18" rx="5" ry="7" />
        </svg>
      ))}
    </div>
  );
}

function Typewriter({ text, speed = 65 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <>{shown}</>;
}

function useAudio() {
  const romanticRef = useRef(null);
  const quizRef     = useRef(null);
  const batmanRef   = useRef(null);
  const thunderRef  = useRef(null);

  useEffect(() => {
    const make = (src, loop = true) => {
      const a = new Audio(src);
      a.loop   = loop;
      a.volume = 0.25;
      return a;
    };
    romanticRef.current = make(ROMANTIC_MUSIC);
    quizRef.current     = make(QUIZ_MUSIC);
    batmanRef.current   = make(BATMAN_MUSIC);
    thunderRef.current  = make(THUNDER_SFX, false);

    return () => {
      [romanticRef, quizRef, batmanRef, thunderRef].forEach(r => {
        r.current?.pause();
        r.current = null;
      });
    };
  }, []);

  const stopAll = () => {
    [romanticRef, quizRef, batmanRef].forEach(r => {
      if (r.current) { r.current.pause(); r.current.currentTime = 0; }
    });
  };

  const play = (ref, volume = 0.25) => {
    if (!ref.current) return;
    ref.current.volume = volume;
    ref.current.play().catch(() => {});
  };

  return { romanticRef, quizRef, batmanRef, thunderRef, stopAll, play };
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

  @keyframes fallDown {
    from { transform: translateY(-50px) rotate(0deg); }
    to   { transform: translateY(110vh)  rotate(30deg); opacity: 0; }
  }
  @keyframes flyBat {
    from { transform: translateX(-80px); }
    to   { transform: translateX(110vw); }
  }
  @keyframes heartPulse {
    0%,100% { transform: scale(1);    }
    40%     { transform: scale(1.22); }
    60%     { transform: scale(1);    }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes shimmer {
    from { background-position: -500px 0; }
    to   { background-position:  500px 0; }
  }
  @keyframes riddlerFlicker {
    0%,89%,91%,100% { opacity: 1;   }
    90%             { opacity: 0.3; }
  }
  @keyframes wrongShake {
    0%,100% { transform: translateX(0);   }
    20%     { transform: translateX(-7px); }
    40%     { transform: translateX(7px);  }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px);  }
  }
`;

function GlobalStyles() {
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);
  return null;
}

export default function App() {
  const [phase, setPhase]               = useState("click");
  const [opacity, setOpacity]           = useState(1);
  const [showTransImg, setShowTransImg] = useState(false);
  const [transImgOpacity, setTransImgOpacity] = useState(0);

  const [quizStep, setQuizStep]   = useState(0);
  const [selected, setSelected]   = useState(null);
  const [wrong, setWrong]         = useState(false);
  const [quizDone, setQuizDone]   = useState(false);

  const [countdown, setCountdown]     = useState(null);
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [copied, setCopied]           = useState(false);

  const heartItems    = useFallingHearts();
  const questionItems = useFallingQuestions();

  const { romanticRef, quizRef, batmanRef, thunderRef, stopAll, play } = useAudio();

  usePageMeta(showTransImg ? "transition" : phase);

  const handleClickScreen = () => {
    setPhase("romantic");
    play(romanticRef);
  };

  const goToQuiz = () => {
    setPhase("quiz");
    play(romanticRef, 0);
    if (romanticRef.current) {
      let v = 0.25;
      const fade = setInterval(() => {
        v = Math.max(0, v - 0.025);
        if (romanticRef.current) romanticRef.current.volume = v;
        if (v <= 0) { clearInterval(fade); romanticRef.current?.pause(); play(quizRef); }
      }, 60);
    } else {
      play(quizRef);
    }
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const q = QUIZ[quizStep];
    if (idx !== q.answer) {
      setWrong(true);
      setTimeout(() => { setSelected(null); setWrong(false); }, 900);
    } else {
      setTimeout(() => {
        if (quizStep + 1 >= QUIZ.length) setQuizDone(true);
        else { setQuizStep(quizStep + 1); setSelected(null); }
      }, 480);
    }
  };

  const handleReveal = () => {
    if (countdown !== null) return;
    let c = 5;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) { clearInterval(iv); setCountdown(null); beginTransition(); }
    }, 1000);
  };

  const beginTransition = () => {
    setPhase("transition");
    stopAll();
    if (thunderRef.current) { thunderRef.current.volume = 0.45; thunderRef.current.play().catch(() => {}); }
    
    let startTime = Date.now();
    const fadeDuration = 800;
    const holdDuration = 2400;
    const totalDuration = fadeDuration + holdDuration + fadeDuration;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < fadeDuration) {
        const fadeProgress = elapsed / fadeDuration;
        setOpacity(1 - fadeProgress);
      } else if (elapsed < fadeDuration + holdDuration) {
        const holdProgress = (elapsed - fadeDuration) / holdDuration;
        setShowTransImg(true);
        setTransImgOpacity(
          holdProgress < 0.25 
            ? holdProgress / 0.25 
            : holdProgress > 0.75 
              ? 1 - (holdProgress - 0.75) / 0.25 
              : 1
        );
      } else if (elapsed < totalDuration) {
        const fadeInProgress = (elapsed - fadeDuration - holdDuration) / fadeDuration;
        setShowTransImg(false);
        setPhase("batman");
        play(batmanRef);
        setOpacity(fadeInProgress);
      } else {
        setOpacity(1);
        return;
      }

      if (elapsed < totalDuration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GIFT_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (showTransImg) {
    return (
      <>
        <GlobalStyles />
        <div style={{
          position: "fixed", inset: 0, background: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src={TRANSITION_IMAGE}
            alt=""
            style={{
              maxHeight: "80vh", maxWidth: "80vw", objectFit: "contain",
              opacity: transImgOpacity,
              transition: "opacity 0.01s linear",
            }}
          />
        </div>
      </>
    );
  }

  if (phase === "click") {
    return (
      <>
        <GlobalStyles />
        <div
          onClick={handleClickScreen}
          style={{
            minHeight: "100vh", background: "#fce4ec",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", userSelect: "none",
          }}
        >
          <div style={{
            fontSize: "72px",
            color: "#e91e8c",
            lineHeight: 1,
            animation: "heartPulse 1.7s ease-in-out infinite",
          }}>
            ♥
          </div>
          <p style={{
            marginTop: "28px",
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(17px, 4vw, 24px)",
            color: "#c2185b",
            letterSpacing: "0.5px",
          }}>
            toque para continuar
          </p>
        </div>
      </>
    );
  }

  if (phase === "romantic") {
    return (
      <>
        <GlobalStyles />
        <div style={{
          minHeight: "100vh", background: "#fce4ec",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          padding: "24px",
          opacity, transition: "opacity 0.04s",
        }}>
          <Cascade items={heartItems} />

          <div style={{
            position: "relative", zIndex: 1,
            background: "rgba(255,255,255,0.70)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "clamp(32px,6vw,56px) clamp(32px,7vw,64px)",
            maxWidth: "500px", width: "100%", textAlign: "center",
            boxShadow: "0 4px 32px rgba(194,24,91,0.12)",
            border: "1px solid rgba(194,24,91,0.15)",
            animation: "fadeUp 0.7s ease both",
          }}>
            <h1 style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(30px, 7vw, 50px)",
              color: "#c2185b",
              lineHeight: 1.2,
              marginBottom: "14px",
            }}>
              feliz dia dos namorados
            </h1>

            <p style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(20px, 5vw, 32px)",
              color: "#e91e8c",
              marginBottom: "24px",
            }}>
              eu te amo muito
            </p>

            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(13px, 2.8vw, 15px)",
              color: "#880e4f",
              lineHeight: 1.75,
              marginBottom: "36px",
            }}>
              tenho uma surpresinha especial pra você...<br />
              mas primeiro resolva essa charada.
            </p>

            <button
              onClick={goToQuiz}
              style={{
                background: "#c2185b",
                color: "#fff",
                border: "none",
                borderRadius: "40px",
                padding: "clamp(11px,2.5vw,15px) clamp(30px,6vw,52px)",
                fontSize: "clamp(14px, 3vw, 16px)",
                fontFamily: "Georgia, serif",
                cursor: "pointer",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 18px rgba(194,24,91,0.25)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#ad1457"}
              onMouseLeave={e => e.currentTarget.style.background = "#c2185b"}
            >
              charada?
            </button>
          </div>
        </div>
      </>
    );
  }

  if (phase === "quiz") {
    const q        = QUIZ[quizStep];
    const isLast   = quizStep === QUIZ.length - 1;
    const progress = (quizStep / QUIZ.length) * 100;

    return (
      <>
        <GlobalStyles />
        <div style={{
          minHeight: "100vh", background: "#0a1a0a",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          padding: "24px",
        }}>
          <Cascade items={questionItems} />

          <div style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.025) 3px, rgba(0,255,65,0.025) 4px)",
          }} />

          <div style={{
            position: "relative", zIndex: 2,
            maxWidth: "560px", width: "100%",
            animation: "fadeUp 0.5s ease both",
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(28px, 7vw, 42px)",
                color: "#00ff41",
                letterSpacing: "7px",
                animation: "riddlerFlicker 5s infinite",
              }}>
                ? o charada ?
              </div>
              <div style={{
                color: "#00ff4155",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "11px",
                letterSpacing: "4px",
                marginTop: "6px",
              }}>
                {quizStep + 1} / {QUIZ.length}
              </div>
              <div style={{
                marginTop: "12px", height: "2px",
                background: "#00ff4118", borderRadius: "2px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "#00ff41",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {!quizDone ? (
              <div style={{
                background: "#050e05",
                border: "1px solid #00ff4133",
                borderRadius: "14px",
                padding: "clamp(24px,5vw,40px)",
                boxShadow: "0 0 28px rgba(0,255,65,0.05)",
              }}>
                <p style={{
                  color: "#00ff41",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "clamp(13px, 3vw, 17px)",
                  lineHeight: 1.65,
                  marginBottom: "26px",
                  animation: wrong ? "wrongShake 0.4s ease" : "none",
                }}>
                  {q.question}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {q.options.map((opt, i) => {
                    const isSel     = selected === i;
                    const isCorrect = isSel && i === q.answer;
                    const isWrong   = isSel && i !== q.answer;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        style={{
                          background: isCorrect ? "#003300" : isWrong ? "#1a0000" : "#0a1a0a",
                          border: `1px solid ${isCorrect ? "#00ff41" : isWrong ? "#ff3333" : "#00ff4128"}`,
                          color: isCorrect ? "#00ff41" : isWrong ? "#ff4444" : "#00cc33",
                          borderRadius: "8px",
                          padding: "clamp(10px,2.5vw,13px) clamp(14px,3vw,20px)",
                          fontSize: "clamp(12px, 2.8vw, 14px)",
                          fontFamily: "'Share Tech Mono', monospace",
                          cursor: selected !== null ? "default" : "pointer",
                          textAlign: "left",
                          transition: "background 0.12s, border-color 0.12s",
                          letterSpacing: "0.3px",
                        }}
                        onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "#0e1f0e"; }}
                        onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "#0a1a0a"; }}
                      >
                        {isLast ? opt : `${String.fromCharCode(65 + i)}.  ${opt}`}
                      </button>
                    );
                  })}
                </div>

                {wrong && (
                  <p style={{
                    color: "#ff4444",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "12px",
                    marginTop: "14px",
                    letterSpacing: "1px",
                  }}>
                    resposta errada. tente novamente.
                  </p>
                )}
              </div>
            ) : (
              <div style={{
                background: "#050e05",
                border: "1px solid #00ff4155",
                borderRadius: "14px",
                padding: "clamp(28px,6vw,48px)",
                textAlign: "center",
                boxShadow: "0 0 36px rgba(0,255,65,0.08)",
                animation: "fadeUp 0.5s ease both",
              }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(22px, 6vw, 34px)",
                  color: "#00ff41",
                  letterSpacing: "5px",
                  marginBottom: "12px",
                }}>
                  correto, detetive.
                </div>
                <p style={{
                  color: "#00cc33",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "clamp(12px, 2.8vw, 14px)",
                  lineHeight: 1.7,
                  marginBottom: "30px",
                }}>
                  você provou que merece a recompensa.<br />
                  está pronta para revelar o presente?
                </p>

                <div style={{ position: "relative", display: "inline-block" }}>
                  {countdown !== null && (
                    <div style={{
                      position: "absolute",
                      top: "-36px", left: "50%",
                      transform: "translateX(-50%)",
                      background: "#00ff41", color: "#000",
                      width: "30px", height: "30px",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "17px",
                    }}>
                      {countdown}
                    </div>
                  )}
                  <button
                    onClick={handleReveal}
                    disabled={countdown !== null}
                    style={{
                      background: countdown !== null ? "#003300" : "#00ff41",
                      color: countdown !== null ? "#00ff41" : "#000",
                      border: "1px solid #00ff41",
                      borderRadius: "8px",
                      padding: "clamp(11px,2.5vw,15px) clamp(26px,5vw,44px)",
                      fontSize: "clamp(13px, 3vw, 16px)",
                      fontFamily: "'Bebas Neue', sans-serif",
                      letterSpacing: "3px",
                      cursor: countdown !== null ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {countdown !== null ? "aguarde..." : "revelar presente"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (phase === "batman") {
    return (
      <>
        <GlobalStyles />
        <div style={{
          minHeight: "100vh", background: "#000",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          padding: "24px",
          opacity, transition: "opacity 0.04s",
        }}>
          <FlyingBats />

          <div style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
          }} />

          <div style={{
            position: "relative", zIndex: 2,
            maxWidth: "600px", width: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center",
            animation: "fadeUp 0.8s ease both",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 10vw, 66px)",
              color: "#e8c800",
              letterSpacing: "10px",
              lineHeight: 1,
              textShadow: "0 0 16px rgba(232,200,0,0.2)",
              marginBottom: "4px",
            }}>
              lego® batman™
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(12px, 3vw, 17px)",
              color: "#e8c80055",
              letterSpacing: "6px",
              marginBottom: "28px",
            }}>
              legacy of the dark knight
            </div>

            <img
              src={GAME_COVER}
              alt="lego batman"
              style={{
                width: "100%",
                maxWidth: "320px",
                borderRadius: "10px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.9), 0 0 0 1px #e8c80018",
                marginBottom: "28px",
                objectFit: "cover",
              }}
            />

            <div style={{
              width: "100%",
              background: "#080808",
              border: "1px solid #e8c80028",
              borderRadius: "14px",
              padding: "clamp(20px,5vw,34px)",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "10px",
                color: "#e8c80044",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}>
                código de resgate — steam
              </p>

              {!keyRevealed ? (
                <button
                  onClick={() => setKeyRevealed(true)}
                  style={{
                    background: "#e8c800",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    padding: "clamp(11px,2.5vw,14px) clamp(24px,5vw,42px)",
                    fontSize: "clamp(13px, 3vw, 16px)",
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "3px",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  revelar key
                </button>
              ) : (
                <>
                  <div style={{
                    background: "#040404",
                    border: "1px solid #e8c80028",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: "14px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(90deg, transparent, rgba(232,200,0,0.04), transparent)",
                      backgroundSize: "600px 100%",
                      animation: "shimmer 3s infinite linear",
                      pointerEvents: "none",
                    }} />
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "clamp(17px, 4.5vw, 26px)",
                      color: "#e8c800",
                      letterSpacing: "5px",
                    }}>
                      <Typewriter text={GIFT_KEY} speed={75} />
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    style={{
                      background: copied ? "#1a3a1a" : "transparent",
                      color: copied ? "#4caf50" : "#e8c80077",
                      border: `1px solid ${copied ? "#4caf5066" : "#e8c80033"}`,
                      borderRadius: "6px",
                      padding: "8px 22px",
                      fontSize: "11px",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: "2px",
                      cursor: "pointer",
                      transition: "all 0.25s",
                      marginBottom: "26px",
                    }}
                  >
                    {copied ? "copiado" : "copiar key"}
                  </button>
                </>
              )}

              <div style={{
                borderTop: "1px solid #e8c80014",
                paddingTop: "20px",
                marginTop: keyRevealed ? "0" : "20px",
              }}>
                <p style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "clamp(14px, 3.5vw, 19px)",
                  color: "#c89090",
                  lineHeight: 1.85,
                }}>
                  ativa lá na steam, meu amor,<br />
                  e aproveita as aventuras do batman muahaha
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
