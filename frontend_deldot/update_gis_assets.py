# to run update_gis_assets.py use  python update_gis_assets.py '{}' 2040 this is if we were to implement a backend! 
import os
import sys
import json
import geopandas as gpd
import folium
import matplotlib.pyplot as plt

def generate_maps(live_data_json, selected_year=2050):
    # 1. Parse the dynamic state passed from the dashboard execution
    try:
        revenue_data = json.loads(live_data_json)
    except Exception as e:
        print(f"Error parsing JSON data: {e}")
        return

    # Target path relative to this script location
    output_dir = './frontend_deldot/public/'
    os.makedirs(output_dir, exist_ok=True)

    print("Fetching spatial layers from Census Bureau...")
    # 2. Fetch the true geographic coordinates of Delaware
    counties_gdf = gpd.read_file('https://www2.census.gov/geo/tiger/TIGER2023/COUNTY/tl_2023_us_county.zip')
    de_counties = counties_gdf[counties_gdf['STATEFP'] == '10'].copy()
    de_counties = de_counties[['GEOID', 'NAME', 'geometry']]

    # 3. Map the real-time runtime values down to the explicit GEOID vector rows
    de_counties['cost_per_vehicle'] = de_counties['GEOID'].map(revenue_data).fillna(0)

    # ── GENERATE STATIC IMAGES (Matplotlib) ───────────────────────────────────
    print("Baking crisp vector images...")
    fig, ax = plt.subplots(1, 1, figsize=(6, 9))
    
    # Dynamic blue-ramp gradient baseline matching your dashboard theme
    de_counties.plot(
        column='cost_per_vehicle',
        cmap='Blues',
        linewidth=1.5,
        edgecolor='#ffffff',
        legend=True,
        legend_kwds={'label': 'Cost per Vehicle ($)', 'orientation': 'horizontal', 'pad': 0.05},
        ax=ax
    )

    # Calculate real mathematical centroids for placement anchors rather than guessing paths
    for _, row in de_counties.iterrows():
        centroid = row.geometry.centroid
        ax.annotate(
            text=f"{row['NAME']}\n${int(row['cost_per_vehicle'])}",
            xy=(centroid.x, centroid.y),
            ha='center', va='center',
            fontsize=10, fontweight='bold', 
            color='#1e293b', # Slate-800 for high readability contrast
            bbox=dict(boxstyle="round,pad=0.3", fc="#ffffff", alpha=0.6, ec="none")
        )

    ax.set_title(f'Delaware — Avg Cost Per Vehicle ({selected_year})', fontsize=12, fontweight='bold', pad=10)
    ax.axis('off')
    plt.tight_layout()

    # Overwrite assets directly in the client pipeline distribution path
    plt.savefig(os.path.join(output_dir, 'delaware_cost_map.svg'), format='svg', bbox_inches='tight')
    plt.savefig(os.path.join(output_dir, 'delaware_cost_map.png'), dpi=150, bbox_inches='tight')
    plt.close()

    # ── GENERATE INTERACTIVE LAYER (Folium Map) ────────────────────────────────
    print("Assembling interactive Folium map engine...")
    m = folium.Map(location=[39.15, -75.52], zoom_start=9, tiles='CartoDB positron', zoom_control=False)

    # Add interactive visual choropleth bounds
    folium.Choropleth(
        geo_data=de_counties.__geo_interface__,
        data=de_counties,
        columns=['GEOID', 'cost_per_vehicle'],
        key_on='feature.properties.GEOID',
        fill_color='blues',
        fill_opacity=0.75,
        line_color='white',
        line_weight=2,
        legend_name='Cost Per Vehicle ($)',
    ).add_to(m)

    # Add explicit crisp tooltips on mouse hover actions
    folium.GeoJson(
        de_counties.__geo_interface__,
        style_function=lambda x: {'fillColor': 'transparent', 'color': 'transparent'},
        tooltip=folium.GeoJsonTooltip(
            fields=['NAME', 'cost_per_vehicle'],
            aliases=['County:', 'Forecasted Cost/Vehicle ($):'],
            style='font-family: sans-serif; font-size: 13px; font-weight: bold; padding: 10px; border-radius: 6px;'
        )
    ).add_to(m)

    m.save(os.path.join(output_dir, 'delaware_map.html'))
    print("GIS static and map pipeline compilation complete!")

if __name__ == '__main__':
    # Usage configuration fallback testing or node pipeline arguments execution pass
    if len(sys.argv) > 1:
        mock_input = sys.argv[1]
        year_input = int(sys.argv[2]) if len(sys.argv) > 2 else 2050
    else:
        # Fallback testing configuration dictionary strings
        mock_input = '{"10003": 450, "10001": 380, "10005": 420}'
        year_input = 2050

    generate_maps(mock_input, year_input)