import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { CatalogSplitPane } from './CatalogSplitPane';

describe('CatalogSplitPane', () => {
  it('renders the list and detail panes', () => {
    render(<CatalogSplitPane list={<nav>Class list</nav>} detail={<article>Class detail</article>} />);

    expect(screen.getByRole('navigation')).toHaveTextContent('Class list');
    expect(screen.getByRole('article')).toHaveTextContent('Class detail');
  });
});
