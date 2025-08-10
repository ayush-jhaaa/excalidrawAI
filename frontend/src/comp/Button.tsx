type MyButtonProps = {
  onClick: () => void;
};

const ShinyButton = ({onClick} : MyButtonProps) => {
        return (
          <button
        className="bg-[#1e1e23] p-2 rounded-3xl flex flex-col items-center gap-1 hover:bg-[#2a2a30] transition border hover:shadow-sm justify-center"
        onClick={onClick}
        style={{
          borderImage: 'linear-gradient(135deg, #4b5563, #9ca3af, #ffffff, #9ca3af, #4b5563) 1',
          color: 'transparent',
          background: 'linear-gradient(135deg, #9ca3af 0%, #ffffff 50%, #9ca3af 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text'
        }}
      >
        AI
      </button>
        )}
export default ShinyButton;