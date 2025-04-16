class Anthropic {
  constructor(config: { apiKey: string }) {}

  messages = {
    create: jest.fn().mockResolvedValue({
      content: [
        {
          text: JSON.stringify({
            mainGoal: {
              objective: 'Mocked objective',
              constraints: [],
              priority: 'medium'
            },
            subGoals: []
          })
        }
      ]
    })
  };
}

export default Anthropic; 