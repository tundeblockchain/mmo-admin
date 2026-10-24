import { ClassCatalogPanel, SkillCatalogPanel } from './ClassSkillPanels';
import { CombatConstantsCatalogPanel } from './CombatConstantsCatalogPanel';
import { ElementCatalogPanel, ResonanceCatalogPanel, StatusCatalogPanel } from './OtherCatalogPanels';
import type { CatalogWorkspace } from './panelShared';

export function CatalogTypeContent({ workspace }: { workspace: CatalogWorkspace }) {
  switch (workspace.selectedType) {
    case 'class':
      return <ClassCatalogPanel workspace={workspace} />;
    case 'skill':
      return <SkillCatalogPanel workspace={workspace} />;
    case 'status':
      return <StatusCatalogPanel workspace={workspace} />;
    case 'element':
      return <ElementCatalogPanel workspace={workspace} />;
    case 'resonance':
      return <ResonanceCatalogPanel workspace={workspace} />;
    case 'combat-constants':
      return <CombatConstantsCatalogPanel workspace={workspace} />;
  }
}
