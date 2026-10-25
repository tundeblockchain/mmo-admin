import type { LatestVersions } from '../types/catalog';
import {
  mergeDraftAndPublished,
  publishedListSource,
  type DraftCatalogSources,
  type PublishedCatalogSources,
} from '../lib/catalogSnapshots';
import { latestVersionFromMap } from '../lib/catalogVersions';
import {
  useClassCatalog,
  useElementCatalog,
  useResonanceCatalog,
  useSkillCatalog,
  useStatusCatalog,
} from './useCatalogData';

export function useCatalogDependencySnapshot(
  drafts: DraftCatalogSources,
  latest: LatestVersions | undefined,
  latestLoaded: boolean,
) {
  const classVersion = latestVersionFromMap(latest, 'class');
  const skillVersion = latestVersionFromMap(latest, 'skill');
  const statusVersion = latestVersionFromMap(latest, 'status');
  const elementVersion = latestVersionFromMap(latest, 'element');
  const resonanceVersion = latestVersionFromMap(latest, 'resonance');

  const classQuery = useClassCatalog(classVersion);
  const skillQuery = useSkillCatalog(skillVersion);
  const statusQuery = useStatusCatalog(statusVersion);
  const elementQuery = useElementCatalog(elementVersion);
  const resonanceQuery = useResonanceCatalog(resonanceVersion);

  const published: PublishedCatalogSources = {
    class: publishedListSource(latestLoaded, classVersion, classQuery),
    skill: publishedListSource(latestLoaded, skillVersion, skillQuery),
    status: publishedListSource(latestLoaded, statusVersion, statusQuery),
    element: publishedListSource(latestLoaded, elementVersion, elementQuery),
    resonance: publishedListSource(latestLoaded, resonanceVersion, resonanceQuery),
  };

  return mergeDraftAndPublished(drafts, published);
}
