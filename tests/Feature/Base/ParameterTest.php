<?php


namespace Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Parameter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class ParameterTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_PARAMETER_INDEX->value,
      EPermissions::P_PARAMETER_STORE->value,
      EPermissions::P_PARAMETER_SHOW->value,
      EPermissions::P_PARAMETER_UPDATE->value,
      EPermissions::P_PARAMETER_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);

    $data = Parameter::factory()->raw();
    $res = $this->post('/api/parameters/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('parameters', $data);
      $data['id'] = $res['id'];
    }

    $res = $this->get('/api/parameters/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['id'] == $data['id']) {
          foreach ($data as $key => $value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('parameters', [...$data, 'disabled_at' => null]);
    $this->put('/api/parameters/' . $data['code'], ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('parameters', [...$data, 'disabled_at' => null]);

    $data = Parameter::factory()->raw(['code' => $data['code']]);
    $this->put('/api/parameters/' . $data['code'], $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('parameters', $data);

    $res = $this->get('/api/parameters/' . $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach ($data as $key => $value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
    }
    $this->delete('/api/parameters/' . $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    $data['deleted_at'] = null;
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('parameters', $data);
  }
}
