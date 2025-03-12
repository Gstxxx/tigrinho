import crypto from 'crypto';

/**
 * Gera uma semente aleatória para o jogo
 */
export function generateSeed(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Gera um hash SHA-256 da semente
 * @param seed Semente para gerar o hash
 */
export function generateHash(seed: string): string {
  return crypto.createHash('sha256').update(seed).digest('hex');
}

/**
 * Calcula o ponto de crash com base na semente
 * @param seed Semente para gerar o ponto de crash
 */
export function calculateCrashPoint(seed: string): number {
  // Gera um hash da semente
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  // Converte os primeiros 8 caracteres do hash para um número entre 0 e 1
  const randomValue = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
  
  // Aplica a fórmula para calcular o ponto de crash
  // Crash = 1 / (1 - R)
  // Limitamos o valor máximo para evitar multiplicadores extremamente altos
  const maxMultiplier = 1000; // Valor máximo do multiplicador
  
  // Ajustamos o valor aleatório para garantir que tenhamos uma distribuição
  // onde a maioria dos crashes ocorre entre 1x e 2x
  // Usamos 0.99 como valor máximo para R para evitar divisão por zero
  const adjustedR = Math.min(randomValue * 0.99, 0.99);
  
  // Aplicamos a fórmula e limitamos ao valor máximo
  const crashPoint = Math.min(100 / (1 - adjustedR), maxMultiplier);
  
  // Arredondamos para 2 casas decimais
  return Math.floor(crashPoint * 100) / 100;
}

/**
 * Verifica se um hash corresponde a uma semente
 * @param hash Hash a ser verificado
 * @param seed Semente a ser verificada
 */
export function verifyHash(hash: string, seed: string): boolean {
  const calculatedHash = generateHash(seed);
  return calculatedHash === hash;
}

/**
 * Calcula o multiplicador atual com base no tempo decorrido
 * @param elapsedTime Tempo decorrido em milissegundos
 * @returns Multiplicador atual
 */
export function calculateMultiplier(elapsedTime: number): number {
  // Fórmula: 1.0003^(tempo em ms) - Reduzido pela metade (era 1.0006)
  // Esta fórmula cria uma curva exponencial que começa em 1.00 e cresce gradualmente
  const multiplier = Math.pow(1.0003, elapsedTime);
  
  // Limitar a precisão para 2 casas decimais
  return Math.floor(multiplier * 100) / 100;
}

/**
 * Calcula o tempo necessário para atingir um determinado multiplicador
 * @param targetMultiplier Multiplicador alvo
 * @returns Tempo em milissegundos
 */
export function calculateTimeToMultiplier(targetMultiplier: number): number {
  // Inverso da fórmula do multiplicador: log(multiplicador) / log(1.0003)
  // Atualizado para usar o novo valor de base (1.0003)
  const timeMs = Math.log(targetMultiplier) / Math.log(1.0003);
  return Math.floor(timeMs);
}

/**
 * Gera dados para a próxima rodada do jogo
 */
export function generateNextGameData() {
  const seed = generateSeed();
  const hash = generateHash(seed);
  const crashPoint = calculateCrashPoint(seed);
  
  return {
    seed,
    hash,
    crashPoint
  };
}

/**
 * Calcula o lucro de uma aposta com base no valor apostado e no multiplicador de cashout
 * @param betAmount Valor apostado
 * @param cashoutMultiplier Multiplicador no momento do cashout
 */
export function calculateProfit(betAmount: number, cashoutMultiplier: number): number {
  return betAmount * cashoutMultiplier - betAmount;
}

/**
 * Gera um ponto de crash aleatório baseado em um hash
 * @param hash Hash para gerar o ponto de crash
 * @returns Ponto de crash (multiplicador)
 */
export function generateCrashPoint(hash: string): number {
  // Usar o hash para gerar um número entre 0 e 1
  const hmac = crypto.createHmac('sha256', 'crash-game-secret');
  hmac.update(hash);
  const hexHash = hmac.digest('hex');
  
  // Converter os primeiros 8 caracteres do hash para um número entre 0 e 1
  const seed = parseInt(hexHash.slice(0, 8), 16) / 0xffffffff;
  
  // Aplicar a distribuição para gerar o ponto de crash
  // Esta fórmula cria uma distribuição onde:
  // - ~50% dos jogos crasham abaixo de 2x
  // - ~33% dos jogos crasham entre 2x e 10x
  // - ~17% dos jogos crasham acima de 10x
  // Quanto maior o valor, mais raro é o multiplicador
  
  // Fórmula: 0.99 / (1 - seed)
  let crashPoint = 0.99 / (1 - seed);
  
  // Limitar a precisão para 2 casas decimais
  crashPoint = Math.floor(crashPoint * 100) / 100;
  
  // Garantir que o valor mínimo seja 1.00
  return Math.max(1.00, crashPoint);
}

/**
 * Gera um hash aleatório para um novo jogo
 * @returns Hash aleatório
 */
export function generateGameHash(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Gera uma seed a partir de um hash
 * @param hash Hash do jogo
 * @returns Seed derivada do hash
 */
export function generateSeedFromHash(hash: string): string {
  const hmac = crypto.createHmac('sha256', 'crash-game-seed-key');
  hmac.update(hash);
  return hmac.digest('hex');
}

/**
 * Verifica se um ponto de crash é válido para um determinado hash e seed
 * @param crashPoint Ponto de crash a ser verificado
 * @param hash Hash do jogo
 * @param seed Seed do jogo
 * @returns Verdadeiro se o ponto de crash for válido
 */
export function verifyCrashPoint(crashPoint: number, hash: string, seed: string): boolean {
  const calculatedSeed = generateSeedFromHash(hash);
  if (calculatedSeed !== seed) {
    return false;
  }
  
  const calculatedCrashPoint = generateCrashPoint(hash);
  
  // Permitir uma pequena margem de erro devido a arredondamentos
  return Math.abs(calculatedCrashPoint - crashPoint) < 0.01;
}

/**
 * Retorna as probabilidades (odds) de diferentes multiplicadores no jogo Crash
 * @returns Um objeto com as probabilidades de diferentes multiplicadores
 */
export function getCrashOdds(): { multiplier: number, probability: number }[] {
  // Baseado na fórmula: 0.99 / (1 - seed)
  // A probabilidade de um multiplicador X é aproximadamente 1 - (0.99/X)
  
  const odds = [
    { multiplier: 1.5, probability: 0.34 }, // ~34% de chance de chegar a 1.5x
    { multiplier: 2.0, probability: 0.505 }, // ~50.5% de chance de chegar a 2x
    { multiplier: 3.0, probability: 0.67 }, // ~67% de chance de chegar a 3x
    { multiplier: 5.0, probability: 0.802 }, // ~80.2% de chance de chegar a 5x
    { multiplier: 10.0, probability: 0.901 }, // ~90.1% de chance de chegar a 10x
    { multiplier: 20.0, probability: 0.9505 }, // ~95.05% de chance de chegar a 20x
    { multiplier: 50.0, probability: 0.9802 }, // ~98.02% de chance de chegar a 50x
    { multiplier: 100.0, probability: 0.9901 }, // ~99.01% de chance de chegar a 100x
  ];
  
  return odds;
} 