"""
Unit Tests for Sunner ESG Sustainability Engine & 4-Stage Evolution
Validates GHG Protocol Scope 1/2/3 calculations, welfare scoring, and audit disclosure.
"""

import os
import sys
import pytest

# Ensure sunner-cloud-gea is in path
cloud_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if cloud_dir not in sys.path:
    sys.path.insert(0, cloud_dir)

from src.esg_analytics_engine import ESGAnalyticsEngine


@pytest.fixture
def esg_engine():
    return ESGAnalyticsEngine()


def test_four_stages_evolution_data_behavior(esg_engine):
    """Verifies that all 4 industrial evolution stages are defined with data behavior characteristics."""
    evo = esg_engine.get_four_stages_evolution()
    assert len(evo["stages"]) == 4
    assert evo["stages"][0]["name"].startswith("Automation")
    assert evo["stages"][1]["name"].startswith("Digitalization")
    assert evo["stages"][2]["name"].startswith("AI-Transformation")
    assert evo["stages"][3]["name"].startswith("Autonomous Agentic Fabric")


def test_single_barn_esg_metrics(esg_engine):
    """Verifies single barn carbon savings and welfare improvements."""
    impact = esg_engine.calculate_esg_impact(scale_to_enterprise=False)

    assert impact["barn_count"] == 1
    assert impact["environmental"]["scope_2_electricity"]["kwh_reduction_pct"] == 28.4
    assert impact["environmental"]["scope_2_electricity"]["scope2_co2_saved_kg_day"] > 100.0
    assert impact["social"]["animal_welfare_score_pct"] == 98.8
    assert impact["social"]["ai_mortality_pct"] == 1.2
    assert impact["social"]["birds_saved_per_flock_batch"] > 1000


def test_enterprise_fleet_esg_scaling(esg_engine):
    """Verifies 50-barn enterprise complex scaling to 2.125M birds."""
    impact = esg_engine.calculate_esg_impact(scale_to_enterprise=True)

    assert impact["barn_count"] == 50
    assert impact["flock_capacity"] == 2125000
    assert impact["environmental"]["total_ghg_saved_metric_tons_year"] > 15000.0  # Over 15k tons CO2e avoided
    assert impact["social"]["birds_saved_per_year"] > 400000


def test_certified_esg_audit_disclosure_generation(esg_engine):
    """Verifies official audit certificate generation."""
    cert = esg_engine.generate_certified_esg_audit_disclosure()

    assert "ESG-AUDIT-SUNNER" in cert["audit_document_id"]
    assert "GHG Protocol" in cert["certification_standard"]
    assert cert["governance_status"] == "FULL_VERIFIED_COMPLIANCE"
    assert cert["signature_hash"].startswith("SHA256:")
