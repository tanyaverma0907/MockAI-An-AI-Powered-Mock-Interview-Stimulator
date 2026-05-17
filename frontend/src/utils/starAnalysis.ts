export interface STARResult {
  situation: boolean;
  task: boolean;
  action: boolean;
  result: boolean;
}

export function checkSTAR(answer: string): STARResult {
  const lower = answer.toLowerCase();
  return {
    situation: /situation|context|background|when i|at my|in my (previous|last|current)|we were|there was/.test(lower),
    task: /task|responsible|needed to|had to|goal|objective|challenge/.test(lower),
    action: /i (did|took|built|created|implemented|solved|used|decided|started|led|worked)|my approach|i (then|first|next)|action/.test(lower),
    result: /result|outcome|impact|achieved|improved|reduced|increased|saved|grew|percent|%|success|delivered/.test(lower),
  };
}

export function starCoveragePercent(star: STARResult): number {
  const vals = Object.values(star);
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
}