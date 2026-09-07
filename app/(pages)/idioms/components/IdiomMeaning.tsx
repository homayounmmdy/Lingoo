interface IdiomMeaningProps {
  meaning: string;
}

export const IdiomMeaning: React.FC<IdiomMeaningProps> = ({ meaning }) => {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ backgroundColor: "#f7469720" }}
    >
      <div className="text-sm text-gray-500 mb-1">معنی</div>
      <p className="text-xl font-bold" style={{ color: "#f74697" }}>
        {meaning}
      </p>
    </div>
  );
};

// components/idioms/IdiomExample.tsx
interface IdiomExampleProps {
  example: string;
  meaning: string;
}

export const IdiomExample: React.FC<IdiomExampleProps> = ({ example, meaning }) => {
  return (
    <>
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "#4097f210" }}
      >
        <div className="text-sm text-gray-500 mb-2">💡 مثال انگلیسی</div>
        <div
          className="text-gray-800 italic leading-relaxed"
          style={{ direction: "ltr" }}
        >
          {example}
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "#ffe07320" }}
      >
        <div className="text-sm text-gray-500 mb-1">📝 معنی مثال</div>
        <p className="text-gray-700">{meaning}</p>
      </div>
    </>
  );
};