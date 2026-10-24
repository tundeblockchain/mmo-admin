import { CombatConstantsDetail } from '../../components/catalog/CombatConstantsDetail';
import { CombatConstantsEditor } from '../../components/catalog/CombatConstantsEditor';
import { getCombatConstantsFieldErrors } from '../../lib/catalogValidation';
import type { CombatConstantsData } from '../../types/catalog';
import type { CatalogWorkspace } from './panelShared';

export function CombatConstantsCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, combatConstantsQuery, currentVersion } = workspace;
  const data = draft
    ? (draft.data as CombatConstantsData)
    : combatConstantsQuery.data?.data;

  if (draft && data) {
    return (
      <CombatConstantsEditor
        data={data}
        onUpdate={workspace.draftActions.handleUpdateCombatConstants}
        fieldErrors={getCombatConstantsFieldErrors(data)}
      />
    );
  }

  return (
    <CombatConstantsDetail
      data={data}
      isLoading={combatConstantsQuery.isPending && currentVersion !== null && !draft}
      error={combatConstantsQuery.error}
    />
  );
}
