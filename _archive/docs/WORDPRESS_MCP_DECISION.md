# WordPress MCP Selection Decision

**Date**: 2026-01-14
**Project**: Subfracture Website Rebuild
**Decision**: Claudeus WP MCP

---

## Context

Building a 6-section single-page scroll site for subfrac.com (culture studio), inspired by:
- https://ashfall.studio/
- https://www.notbadprettygood.com.au/

Existing site runs WordPress with custom theme (mkrst-base/mkrst-child).

---

## Options Evaluated

### 1. WordPress/mcp-adapter (Official)
- **GitHub**: https://github.com/WordPress/mcp-adapter
- **Stars**: 429 | **Forks**: 65
- **Status**: New official standard, replacing Automattic/wordpress-mcp
- **Architecture**: PHP-native, runs inside WordPress
- **Approach**: Exposes WordPress "Abilities API" as MCP tools/resources/prompts
- **Future**: Will be integrated into WordPress Core 6.9

**Pros**:
- Official WordPress backing
- Future-proof (core integration coming)
- No external dependencies
- Lower resource usage
- Extensible via Abilities API

**Cons**:
- Abstract ability mapping vs specific tools
- FSE support depends on registered abilities
- Newer, less battle-tested

### 2. Claudeus WP MCP (Selected)
- **GitHub**: https://github.com/deus-h/claudeus-wp-mcp
- **Stars**: 84 | **Forks**: 39
- **Status**: Production-ready, enterprise-grade
- **Architecture**: External Node.js server, TypeScript
- **Approach**: 145 pre-built specific tools

**Pros**:
- 145 production-ready tools
- Comprehensive FSE support (27 tools)
- Astra Pro integration (11 tools)
- Site health diagnostics (8 tools)
- WooCommerce support (3 tools)
- 100% TypeScript with strict mode
- Enterprise-grade security
- Granular control per operation

**Cons**:
- Requires Node.js >= 22.0.0
- External server process
- More setup complexity

### 3. Automattic/wordpress-mcp (Deprecated)
- **GitHub**: https://github.com/Automattic/wordpress-mcp
- **Stars**: 693 | **Forks**: 103
- **Status**: Being deprecated in favor of WordPress/mcp-adapter
- **Note**: Do not use for new projects

### 4. AI Engine (Meow Apps)
- **URL**: https://meowapps.com/claude-wordpress-mcp/
- **Approach**: WordPress plugin with 30+ tools
- **Pros**: Easy plugin install, actively maintained
- **Cons**: Ties up PHP workers, SSE can be finicky with caching/CDNs

### 5. aaronsb/wordpress-mcp
- **GitHub**: https://github.com/aaronsb/wordpress-mcp
- **Stars**: 2 | **Forks**: 0
- **Note**: Personality-based, niche use case

---

## Tool Comparison: Claudeus vs Official Adapter

| Category | Claudeus WP MCP | Official Adapter |
|----------|-----------------|------------------|
| Content Management | 25 tools | Via Abilities |
| Media & Assets | 6 tools | Via Abilities |
| Taxonomies | 12 tools | Via Abilities |
| User Management | 10 tools | Via Abilities |
| Comments | 8 tools | Via Abilities |
| Menus/Navigation | 10 tools | Basic |
| **FSE (Templates, Styles, Patterns)** | **27 tools** | Limited |
| **Astra Pro Integration** | **11 tools** | None |
| **Site Health/Diagnostics** | **8 tools** | None |
| Search & Discovery | 5 tools | Limited |
| **WooCommerce** | **3 tools** | None |
| System Discovery | 5 tools | Limited |
| **TOTAL** | **145 tools** | Varies |

---

## Decision Rationale

For the Subfracture website rebuild requiring:
1. Sophisticated single-page scroll design
2. Template/theme manipulation
3. Custom CSS and Global Styles control
4. Precise content management

**Claudeus provides**:
- Surgical precision with 145 specific tools
- Native FSE support crucial for modern WordPress theming
- Global Styles manipulation for design consistency
- Template part control for section-based architecture

**The trade-off accepted**:
- External Node.js process (acceptable for development)
- More initial setup (one-time cost)

---

## Setup Requirements

```bash
# Prerequisites
Node.js >= 22.0.0
pnpm (recommended) or npm
WordPress site with REST API enabled
Application password from WordPress

# Installation
npm install -g claudeus-wp-mcp
# Or use directly with npx
npx claudeus-wp-mcp
```

### wp-sites.json Configuration
```json
{
  "subfracture": {
    "URL": "https://subfrac.com",
    "USER": "mkrst",
    "PASS": "APPLICATION_PASSWORD_HERE",
    "authType": "basic"
  }
}
```

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "claudeus-wp-mcp": {
      "command": "npx",
      "args": ["-y", "claudeus-wp-mcp"],
      "env": {
        "WP_SITES_PATH": "/absolute/path/to/wp-sites.json"
      }
    }
  }
}
```

---

## Key Claudeus Tools for This Build

### FSE/Templates (Critical for scroll sections)
- `get_templates`, `create_template`, `update_template`
- `get_template_parts`, `create_template_part`, `update_template_part`
- `get_global_styles`, `update_global_styles`
- `get_local_patterns`, `search_pattern_directory`

### Content Management
- `get_pages`, `create_page`, `update_page`
- `get_blocks`, `create_block`, `update_block`

### Media
- `upload_media`, `update_media`, `update_alt_text`

### Site Configuration
- `get_settings`, `update_settings`
- `list_themes`, `get_custom_css`, `update_custom_css`

---

## Sources & References

- [Claudeus WP MCP GitHub](https://github.com/deus-h/claudeus-wp-mcp)
- [WordPress MCP Adapter GitHub](https://github.com/WordPress/mcp-adapter)
- [MCP Adapter Announcement](https://make.wordpress.org/ai/2025/07/17/mcp-adapter/)
- [Meow Apps Guide](https://meowapps.com/claude-wordpress-mcp/)
- [InstaWP WordPress MCP Guide](https://instawp.com/wordpress-mcp/)

---

## Website Content (Approved Copy)

### Section Structure
1. **Hero** - "Culture Studio" + tagline + sizzle reel
2. **What We Do** - "Where art and systems flow together"
3. **Services** - 5-service grid (Strategy, Creative, Brand, Tech, Media)
4. **AI System Design** - DANNI + SubFrac.OS explanation
5. **Approach** - "Sustained Collective Pretending"
6. **What We Fight** - Values/opposition framework
7. **Footer** - "A culture studio. Art and systems, flowing together."

### Design References
- https://ashfall.studio/ - Clean, sophisticated, bold typography
- https://www.notbadprettygood.com.au/ - Conversational, human, founder personality

---

*Decision documented for future reference and conversation continuity.*
