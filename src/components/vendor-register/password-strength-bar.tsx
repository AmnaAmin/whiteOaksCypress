import './password-strength-bar.css';


export interface IPasswordStrengthBarProps {
  password: string;
}

const defaultColor = 'rgb(221, 221, 221)';

const colors = ['#F00', '#F90', '#FF0', '#A5CD70', '#A5CD70'];

export const measureStrength = (p: string): [number, number] => {
  let force = 0;
  const regex = /[$&+,:;=?@#|'<>.^*()%!-]/g;
  const flags = {
    lowerLetters: /[a-z]+/.test(p),
    upperLetters: /[A-Z]+/.test(p),
    numbers: /[0-9]+/.test(p),
    symbols: regex.test(p),
  };

  const passedMatches = Object.values(flags).filter((isMatchedFlag: boolean) => !!isMatchedFlag).length;

  force += 2 * p.length + (p.length >= 10 ? 1 : 0);
  force += passedMatches * 10;

  // penalty (short password)
  force = p.length <= 6 ? Math.min(force, 10) : force;

  // penalty (poor variety of characters)
  force = passedMatches === 1 ? Math.min(force, 10) : force;
  force = passedMatches === 2 ? Math.min(force, 20) : force;
  force = passedMatches === 3 ? Math.min(force, 40) : force;

  return [force, passedMatches];
};

export const PasswordStrengthBar = ({ password }: IPasswordStrengthBarProps) => {
  const getColor = (s: number): any => {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return { idx: idx + 1, col: colors[idx] };
  };

  const getPoints = force => {
    const pts = [] as any[];
    for (let i = 0; i < 5; i++) {
      pts.push(<li key={i} className="point" style={i < force.idx ? { backgroundColor: force.col } : { backgroundColor: '#DDD' }} />);
    }
    return pts;
  };

  const strength = password ? getColor(measureStrength(password)[0]) : defaultColor;
  const points = getPoints(strength);

  return (
    <div id="strength" className="form-group" style={{ position: "relative", top: "-10px" }}>
      <ul id="strengthBar" className="pl-0 mb-0">
        {points}
      </ul>
    </div>
  );
};

export default PasswordStrengthBar;