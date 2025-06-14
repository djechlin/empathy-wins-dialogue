interface DosDontsProps {
  doHeading: string;
  dontHeading: string;
  doVoter?: string;
  doCanvasser: string;
  dontVoter?: string;
  dontCanvasser: string;
}

const DosDonts = ({ doHeading, dontHeading, doVoter, doCanvasser, dontVoter, dontCanvasser }: DosDontsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>
      <div className="pr-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600">✓</span>
          <span className="font-medium text-gray-900 text-sm">{doHeading}</span>
        </div>
        <p className="font-mono text-sm text-gray-700">
          {doVoter && (
            <>
              <span className="font-bold">Voter:</span> {doVoter}
              <br />
            </>
          )}
          <span className="font-bold">You:</span> {doCanvasser}
        </p>
      </div>
      <div className="pl-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-600">✗</span>
          <span className="font-medium text-gray-900 text-sm">{dontHeading}</span>
        </div>
        <p className="font-mono text-sm text-gray-700">
          {dontVoter && (
            <>
              <span className="font-bold">Voter:</span> {dontVoter}
              <br />
            </>
          )}
          <span className="font-bold">You:</span> {dontCanvasser}
        </p>
      </div>
    </div>
  );
};

export default DosDonts;
