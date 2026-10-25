import {
  useClassCatalog,
  useCombatConstantsCatalog,
  useElementCatalog,
  useResonanceCatalog,
  useSkillCatalog,
  useStatusCatalog,
} from '../../hooks/useCatalogData';
import type { DraftStore } from '../../hooks/draftStore';
import { publishedVersionOrNull } from '../../lib/catalogVersions';
import type { CatalogType } from '../../types/catalog';
import { catalogDataByType, type VersionSelections } from './catalogPageUtils';

export function useCatalogQueries(drafts: DraftStore, versions: VersionSelections) {
  const classQuery = useClassCatalog(
    publishedVersionOrNull(drafts.class?.sourceVersion ?? versions.class),
  );
  const skillQuery = useSkillCatalog(
    publishedVersionOrNull(drafts.skill?.sourceVersion ?? versions.skill),
  );
  const statusQuery = useStatusCatalog(
    publishedVersionOrNull(drafts.status?.sourceVersion ?? versions.status),
  );
  const elementQuery = useElementCatalog(
    publishedVersionOrNull(drafts.element?.sourceVersion ?? versions.element),
  );
  const resonanceQuery = useResonanceCatalog(
    publishedVersionOrNull(drafts.resonance?.sourceVersion ?? versions.resonance),
  );
  const combatConstantsQuery = useCombatConstantsCatalog(
    publishedVersionOrNull(
      drafts['combat-constants']?.sourceVersion ?? versions['combat-constants'],
    ),
  );

  const catalogQueryData = {
    class: classQuery.data?.data,
    skill: skillQuery.data?.data,
    status: statusQuery.data?.data,
    element: elementQuery.data?.data,
    resonance: resonanceQuery.data?.data,
    'combat-constants': combatConstantsQuery.data?.data,
  };

  return {
    classQuery,
    skillQuery,
    statusQuery,
    elementQuery,
    resonanceQuery,
    combatConstantsQuery,
    catalogQueryData,
    originalDataFor: (type: CatalogType) => catalogDataByType(type, catalogQueryData),
  };
}
