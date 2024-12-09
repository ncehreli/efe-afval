import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import Confetti from "react-confetti";

type TrashItem = {
  name: string;
  icon: string;
};

type TrashCategory = {
  items: TrashItem[];
};

type TrashImages = {
  [category: string]: TrashCategory;
};

const trashImages: TrashImages = {
  // Hardcoded trash item data
  GFT: {
    items: [
      { name: "Appel", icon: "🍎" },
      { name: "Sla", icon: "🥬" },
      { name: "Eierschaal", icon: "🥚" },
      { name: "Aardappelschillen", icon: "🥔" },
      { name: "Bananenschil", icon: "🍌" },
      { name: "Koffiedik", icon: "☕" },
      { name: "Theezakje", icon: "🍵" },
      { name: "Bladeren", icon: "🍂" },
      { name: "Gras", icon: "🌱" },
      { name: "Bloemen", icon: "🌸" },
    ],
  },
  PMD: {
    items: [
      { name: "Plastic Fles", icon: "🧴" },
      { name: "Blikje", icon: "🥤" },
      {
        name: "Melkpak",
        icon: "data:image/png;base64,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",
      },
      { name: "Plastic Zakje", icon: "🛍️" },
      { name: "Yoghurtbeker", icon: "🍶" },
      { name: "Chipszak", icon: "🍟" },
      { name: "Boterkuipje", icon: "🧈" },
      { name: "Plastic Beker", icon: "🥛" },
      { name: "Aluminium Folie", icon: "🌟" },
      { name: "Petflesdop", icon: "🔘" },
      { name: "Blikvoerblik", icon: "🐾" },
    ],
  },
  Restafval: {
    items: [
      { name: "Vuile Tissue", icon: "🧻" },
      { name: "Stuk Plastic", icon: "🗑️" },
      { name: "Kauwgom", icon: "🍬" },
      { name: "Kapotte Pen", icon: "✒️" },
      { name: "Vuile Folie", icon: "🛡️" },
      { name: "Stofzuigerzak", icon: "🧹" },
      { name: "Cd/Dvd", icon: "💿" },
      { name: "Kapotte Lamp", icon: "💡" },
      { name: "Bont En Lederen Restjes", icon: "👢" },
      { name: "Textielresten", icon: "🧵" },
    ],
  },
  Glas: {
    items: [
      { name: "Glazen Pot", icon: "🍯" },
      { name: "Wijnfles", icon: "🍾" },
      { name: "Drinkglas", icon: "🥃" },
      { name: "Frisdrankfles", icon: "🥤" },
      { name: "Oude Vaas", icon: "🏺" },
      { name: "Bierfles", icon: "🍺" },
      { name: "Parfumfles", icon: "🌸" },
      { name: "Conservenpot", icon: "🥫" },
    ],
  },
};

const TrashSortingGame = () => {
  type Trash = {
    name: string;
    icon: string;
    category: string;
  };

  const [currentTrash, setCurrentTrash] = useState<Trash | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isPerfectScore, setIsPerfectScore] = useState(false);
  const [askedTrashNames, setAskedTrashNames] = useState<string[]>([]);

  // Game configuration
  const MAX_ROUNDS = 10;
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Randomly select a trash item
  const getRandomTrash = useCallback(() => {
    const categories = Object.keys(trashImages);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const items = trashImages[randomCategory].items.filter(
      (item) => !askedTrashNames.includes(item.name)
    );
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setAskedTrashNames([...askedTrashNames, randomItem.name]);

    return {
      category: randomCategory,
      ...randomItem,
    };
  }, [askedTrashNames]);

  // Start a new round
  const startNewRound = useCallback(() => {
    if (roundsPlayed >= MAX_ROUNDS) {
      setGameOver(true);
      return;
    }
    setCurrentTrash(getRandomTrash());
    setRoundsPlayed((prev) => prev + 1);
    setFeedback(null);
  }, [getRandomTrash, roundsPlayed]);

  // Use effect to start first round
  useEffect(() => {
    if (roundsPlayed === 0) {
      startNewRound();
    }
  }, [startNewRound, roundsPlayed]);

  // Check for perfect score
  useEffect(() => {
    if (gameOver && streak === MAX_ROUNDS) {
      setIsPerfectScore(true);
    }
  }, [gameOver, streak]);

  // Handle trash sorting
  interface Feedback {
    type: "success" | "failure";
    message: string;
  }

  const handleTrashSort = (selectedCategory: string) => {
    if (!currentTrash) return;

    if (selectedCategory === currentTrash.category) {
      // Correct sorting
      const pointsEarned = streak > 0 ? streak * 10 : 10;
      const newScore = score + pointsEarned;
      setScore(newScore);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak(Math.max(maxStreak, newStreak));
        return newStreak;
      });

      // Show success feedback
      const successFeedback: Feedback = {
        type: "success",
        message: `Goed gedaan! (+${pointsEarned} punten)`,
      };
      setFeedback(successFeedback);

      // Start next round after a short delay
      setTimeout(startNewRound, 1000);
    } else {
      // Incorrect sorting
      setStreak(0);

      // Show failure feedback
      const failureFeedback: Feedback = {
        type: "failure",
        message: `Helaas, dit hoort bij ${currentTrash.category}!`,
      };
      setFeedback(failureFeedback);

      // Start next round after a short delay
      setTimeout(startNewRound, 1000);
    }
  };

  // Restart game
  const restartGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setRoundsPlayed(0);
    setAskedTrashNames([]);
    setGameOver(false);
    setFeedback(null);
    startNewRound();
  }, [startNewRound]);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
        {isPerfectScore && <Confetti />}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Spel Voorbij!</h2>
          <p className="text-xl mb-4">Je Score: {score}</p>
          <p className="text-lg mb-4">Hoogste Streak: {maxStreak}</p>
          <button
            onClick={restartGame}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            Opnieuw Spelen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Afval Sorteer Spel</h1>

        {/* Score and Streak Display */}
        <div className="flex justify-between mb-6">
          <div className="text-left">
            <p className="text-lg">
              Score: <span className="font-bold">{score}</span>
            </p>
            <p className="text-lg">
              Streak: <span className="font-bold text-green-600">{streak}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg">
              Ronde:{" "}
              <span className="font-bold">
                {roundsPlayed}/{MAX_ROUNDS}
              </span>
            </p>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="h-12 mb-4">
          {feedback && (
            <div
              className={`p-3 rounded-lg animate-pulse ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="inline-block mr-2" />
              ) : (
                <XCircle className="inline-block mr-2" />
              )}
              {feedback.message}
            </div>
          )}
        </div>

        {/* Current Trash Item */}
        {currentTrash && (
          <div className="mb-6">
            <h2 className="text-2xl mb-4">Waar gooi je dit afval?</h2>
            <div className="flex justify-center mb-4">
              {currentTrash.icon.startsWith("data:image") ? (
                <img
                  src={currentTrash.icon}
                  alt={currentTrash.name}
                  className="w-24 h-24"
                />
              ) : (
                <div className="text-8xl">{currentTrash.icon}</div>
              )}
            </div>
            <p className="text-xl font-semibold">{currentTrash.name}</p>
          </div>
        )}

        {/* Sorting Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(trashImages).map((category) => (
            <button
              key={category}
              onClick={() => handleTrashSort(category)}
              className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105 active:scale-95"
            >
              {category} Bak
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrashSortingGame;
