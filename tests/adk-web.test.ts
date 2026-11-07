import { expect, it, vi } from 'vitest';
import { createWebAgent } from '../workshop/adk-runtime.js';

it('carga cuatro especialistas independientes desde los ejercicios sin inferencia', async () => {
  const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No se permite red en esta prueba'));
  try {
    for (const role of ['strategist', 'copywriter', 'designer', 'editor'] as const) {
      const agent = await createWebAgent(role);
      expect(agent.name).toBe(role);
      expect(agent.instruction).toBeTruthy();
      expect(agent.parentAgent).toBeUndefined();
      const tools = await agent.canonicalTools();
      if (role === 'designer') expect(tools.map(tool => tool.name)).toContain('generate_campaign_image');
      if (role === 'copywriter') expect(tools.map(tool => tool.name)).toContain('load_skill');
    }
    expect(fetch).not.toHaveBeenCalled();
  } finally { fetch.mockRestore(); }
});
